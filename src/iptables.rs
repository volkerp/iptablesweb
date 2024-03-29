mod chain;
mod counter;
mod parse;
mod rule;
mod table;

pub(crate) use chain::Chain;
pub(crate) use counter::Counter;
pub(crate) use rule::Rule;
pub(crate) use table::Table;

use serde::{Serialize, Serializer};
use std::{result::Result as StdResult, str::FromStr};

use anyhow::{Context, Result};
use tokio::process::Command;

use crate::errors::IptablesError;

pub(crate) async fn iptables_save() -> Result<String> {
    let cmd = "iptables-save";

    String::from_utf8(
        Command::new("iptables-save")
            .arg("-c")
            .output().await // run the command and wait for it to finish
            .with_context(|| format!("Failed to run '{cmd}'"))? // '?' is like 'try!'
            .stdout,  // if 'Ok', return 'stdout'
    )
    .with_context(|| format!("Failed {cmd} output to valid UTF-8"))
}

#[allow(dead_code)]
#[derive(Copy, Clone, PartialEq, Debug)]
enum Policy {
    Accept,
    Drop,
}

impl Serialize for Policy {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            Policy::Accept => serializer.serialize_str("ACCEPT"),
            Policy::Drop => serializer.serialize_str("DROP"),
        }
    }
}

impl FromStr for Policy {
    type Err = IptablesError;

    fn from_str(s: &str) -> StdResult<Self, Self::Err> {
        match s {
            "Accept" | "ACCEPT" | "accept" => Ok(Self::Accept),
            "Drop" | "DROP" | "drop" => Ok(Self::Drop),
            _ => Err(IptablesError::InvalidPolicy(s.into())),
        }
    }
}

#[derive(Debug,Serialize)]
pub(crate) struct IptablesState {
    tables: Vec<Table>,
}

impl IptablesState {
    pub(crate) fn new() -> Self { Self { tables: Vec::new() } }

    pub(crate) async fn parse<S: AsRef<str>>(&mut self, out: S) -> Result<()> {
        let mut table: Option<Table> = None;
        let out = out.as_ref();
        for line in out.lines() {
            match &line.as_bytes()[0] {
                b'#' => continue, // Comment
                b'*' => {
                    table = Some(Table::new(&line[1..]));
                } // table
                b':' => {
                    if let Some(ref mut t) = table {
                        t.parse_chain(line)?;
                    }
                } // chain
                b'[' => {
                    if let Some(ref mut t) = table {
                        t.parse_rule(line)?;
                    }
                } // rule
                b'C' => {
                    if let Some(table) = table.clone() {
                        self.tables.push(table); // End of table ('COMMIT')
                    }
                }
                _ => unreachable!(),
            }
        }

        Ok(())
    }
}