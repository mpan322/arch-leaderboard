use arch_client::{
    apis::{
        Error,
        configuration::Configuration,
        time_api::{TimeRecordPostError, time_record_post},
    },
    models::{RecordTimeReqDto, TimeDto},
};

pub struct TimeService {
    config: Configuration,
}

impl TimeService {
    pub fn new(config: Configuration) -> Self {
        Self { config }
    }

    pub async fn record_time(
        &self,
        data: RecordTimeReqDto,
    ) -> Result<TimeDto, Error<TimeRecordPostError>> {
        time_record_post(&self.config, Some(data)).await
    }
}
