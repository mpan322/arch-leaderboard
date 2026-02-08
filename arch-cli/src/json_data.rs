use std::{error::Error, fs::File, io::BufReader};

use arch_client::models::RecordTimeReqDto;
use serde::{Deserialize, Serialize, de::DeserializeOwned};

#[derive(Deserialize, Debug)]
pub struct ApiKeyData {
    pub api_key: String,
}

#[derive(Deserialize, Debug)]
pub struct Metadata {
    cache_file: String,
    language: String,
    millis: i32,
    trace_file: String,
}

#[derive(Deserialize, Serialize)]
pub struct ResultData {
    caches: Vec<CacheData>,
    main_memory_accesses: i32,
}

#[derive(Deserialize, Serialize)]
struct CacheData {
    hits: i32,
    misses: i32,
    name: String,
}

// NOTE: terrible code but I cba
pub fn make_time_record(results: ResultData, metadata: Metadata) -> RecordTimeReqDto {
    RecordTimeReqDto {
        cache_file: metadata.cache_file,
        language: metadata.language,
        millis: metadata.millis,
        output_json: serde_json::to_string(&results).unwrap(),
        trace_file: metadata.trace_file,
    }
}

pub fn parse_file<T: DeserializeOwned>(file_path: &String) -> Result<T, Box<dyn Error>> {
    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let data = serde_json::from_reader(reader)?;
    return Ok(data);
}
