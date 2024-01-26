mod errors;
mod iptables;

use crate::iptables::{iptables_save, IptablesState};

#[tokio::main]
async fn main() {
    let out = iptables_save().await.unwrap();
    let mut state = IptablesState::new();
    state.parse(out).await.unwrap();
    println!("{:#?}", state);

}