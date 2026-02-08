use std::error::Error;

use arch_client::apis::configuration::Configuration;
use clap::Parser;

use crate::{
    args::Args,
    json_data::{ApiKeyData, TimeData, parse_file},
    time::TimeService,
};

mod args;
mod json_data;
mod time;

#[tokio::main]
async fn main() {
    let args = Args::parse();
    let result = run_command(args).await;
    match result {
        Err(CLIError::BadDataFile(err)) => println!("Failed to parse data: {}", err),
        Err(CLIError::UploadFailed(err)) => println!("Failed to upload data: {}", err),
        Err(CLIError::BadAPIFile(err)) => println!("Failed to parse api key file: {}", err),
        Ok(()) => {}
    }
}

enum CLIError {
    BadAPIFile(Box<dyn Error>),
    BadDataFile(Box<dyn Error>),
    UploadFailed(Box<dyn Error>),
}

async fn run_command(args: Args) -> Result<(), CLIError> {
    let api_key = parse_file::<ApiKeyData>(&args.api_key)
        .map_err(CLIError::BadAPIFile)?
        .api_key;

    let time_data = parse_file::<TimeData>(&args.data)
        .map_err(CLIError::BadDataFile)?
        .into();
    println!("[LOG] parsed files");

    let mut config = Configuration::new();
    config.bearer_access_token = Some(api_key);

    println!("[LOG] starting request...");
    let service = TimeService::new(config);
    service
        .record_time(time_data)
        .await
        .map_err(Box::new)
        .map_err(|e| CLIError::UploadFailed(e))?;
    println!("[LOG] upload complete!");

    Ok(())
}
