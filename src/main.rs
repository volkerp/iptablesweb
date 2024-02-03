mod errors;
mod iptables;

use crate::iptables::{iptables_save, IptablesState};

use warp::Filter;
use warp::http::StatusCode;

use rust_embed::RustEmbed;
use warp::reply::json;
use serde_json::json;

#[derive(RustEmbed)]
#[folder = "web/dist"]
struct Static;

#[tokio::main]
async fn main() {

    if std::env::var("RUST_LOG").is_err() {
        std::env::set_var("RUST_LOG", "info");
    }
    env_logger::init();

    // GET /hello/warp => 200 OK with body "Hello, warp!"
    let hello = warp::path!("myapp" / "hello" / String)
        .map(|name| format!("Hello, {}!", name));

    let static_files = warp::path("myapp")
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

    log::info!("Starting server on http://localhost:3030");
    warp::serve(hello.or(static_files).or(iptables).or(error).with(cors))
        .run(([127, 0, 0, 1], 3030))
        .await;
}