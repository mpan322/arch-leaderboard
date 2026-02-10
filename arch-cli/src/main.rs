use std::error::Error;

use arch_client::apis::configuration::Configuration;
use clap::Parser;

use crate::{
    args::Args,
    json_data::{ApiKeyData, Metadata, ResultData, make_time_record, parse_file},
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
        Err(CLIError::BadResultsFile(err)) => println!("Failed to parse results file: {}", err),
        Ok(()) => {}
    }
}

enum CLIError {
    BadAPIFile(Box<dyn Error>),
    BadDataFile(Box<dyn Error>),
    BadResultsFile(Box<dyn Error>),
    UploadFailed(Box<dyn Error>),
}

async fn run_command(args: Args) -> Result<(), CLIError> {
    let api_key = parse_file::<ApiKeyData>(&args.api_key)
        .map_err(CLIError::BadAPIFile)?
        .api_key;

    let results = parse_file::<ResultData>(&args.results).map_err(CLIError::BadResultsFile)?;

    let metadata = parse_file::<Metadata>(&args.metadata).map_err(CLIError::BadDataFile)?;
    let time_record = make_time_record(results, metadata);

    println!("[LOG] parsed files");

    let mut config = Configuration::new();
    config.bearer_access_token = Some(api_key);
    config.base_path = "https://mp322.teaching.cs.st-andrews.ac.uk/api".to_owned();

    println!("[LOG] starting request...");
    let service = TimeService::new(config);
    service
        .record_time(time_record)
        .await
        .map_err(Box::new)
        .map_err(|e| CLIError::UploadFailed(e))?;
    println!("[LOG] upload complete!");

    Ok(())
}
