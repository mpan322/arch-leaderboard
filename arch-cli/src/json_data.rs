use std::{error::Error, fs::File, io::BufReader};

use arch_client::models::RecordTimeReqDto;
use serde::{Deserialize, de::DeserializeOwned};

#[derive(Deserialize, Debug)]
pub struct ApiKeyData {
    pub api_key: String,
}

#[derive(Deserialize, Debug)]
pub struct TimeData {
    cache_file: String,
    language: String,
    millis: i32,
    trace_file: String,
}

impl Into<RecordTimeReqDto> for TimeData {
    fn into(self) -> RecordTimeReqDto {
        RecordTimeReqDto {
            cache_file: self.cache_file,
            language: self.language,
            millis: self.millis,
            output_json: String::new(),
            trace_file: self.trace_file,
        }
    }
}

pub fn parse_file<T: DeserializeOwned>(file_path: &String) -> Result<T, Box<dyn Error>> {
    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let data = serde_json::from_reader(reader)?;
    return Ok(data);
}
