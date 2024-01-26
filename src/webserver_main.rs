mod errors;
mod iptables;

use crate::iptables::{iptables_save, IptablesState};

use warp::Filter;

use rust_embed::RustEmbed;

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
            let out = iptables_save().await.unwrap();
            let mut state = IptablesState::new();
            state.parse(out).await.unwrap();
            format!("{:#?}", state)
        });

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST"])
        .allow_headers(vec!["Content-Type"]);

    log::info!("Starting server on http://localhost:3030");
    warp::serve(hello.or(static_files).with(cors))
        .run(([127, 0, 0, 1], 3030))
        .await;
}