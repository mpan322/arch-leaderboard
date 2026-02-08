use clap::Parser;

#[derive(Parser, Debug)]
#[command(version, about, long_about=None)]
pub struct Args {
    /// path to api key json.
    #[arg(short, long, default_value = "./arch-api-key.json")]
    pub api_key: String,

    /// path to metadata json.
    #[arg(short, long)]
    pub metadata: String,

    /// path to results json.
    #[arg(short, long)]
    pub results: String,
}
