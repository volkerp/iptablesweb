mod errors;
mod iptables;

use crate::iptables::{iptables_save, IptablesState};

use warp::Filter;
use warp::http::{StatusCode, Uri};

use rust_embed::RustEmbed;
use warp::reply::json;
use serde_json::json;
use std::net::IpAddr;
use structopt::StructOpt;

#[derive(RustEmbed)]
#[folder = "web/dist"]
struct Static;

#[derive(Debug, StructOpt)]
struct Opt {
    #[structopt(long, default_value = "localhost")]
    host: String,

    #[structopt(long, default_value = "3030")]
    port: u16,
}


#[tokio::main]
async fn main() {

    if std::env::var("RUST_LOG").is_err() {
        std::env::set_var("RUST_LOG", "info");
    }
    env_logger::init();

    let redirect = warp::path::end().map(|| {
        warp::redirect::see_other(Uri::from_static("/app"))
    });

    let static_files = warp::path("app")
        .and(warp::get())
        .and(warp_embed::embed(&Static))
        .boxed();

    let iptables = warp::path!("iptables")
        .then(|| async {
            match iptables_save().await {
                Ok(out) => {
                    let mut state = IptablesState::new();
                    state.parse(out).await.unwrap();
                    warp::reply::with_status(json(&state), StatusCode::OK)
                }
                Err(_) => {
                    let response = json!({
                        "message": "Failed to parse iptables-save output. Command iptables-save maybe not in your path or you don't have permissions to run it. Try running as root or with sudo."
                    });
                    log::error!("Failed to parse iptables-save output. Command iptables-save maybe not in your path or you don't have permissions to run it. Try running as root or with sudo.");
                    warp::reply::with_status(json(&response), StatusCode::INTERNAL_SERVER_ERROR)
                }
            }
        });

    let error = warp::path("error")
        .and(warp::get())
        .map(|| {
            let error_message = "Internal Server Error";
            let json_response = json(&error_message);
            warp::reply::with_status(json_response, StatusCode::INTERNAL_SERVER_ERROR)
        });

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST"])
        .allow_headers(vec!["Content-Type"]);


    let opt = Opt::from_args();

    log::info!("Starting server on http://{}:{}", opt.host, opt.port);
    warp::serve(iptables.or(redirect).or(static_files).or(error).with(cors))
        .run((opt.host.parse::<IpAddr>().unwrap(), opt.port))
        .await;

}



    