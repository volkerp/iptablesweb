use std::collections::HashMap;

use anyhow::Result;

use serde::Serialize;
use crate::iptables::{Chain, Rule};

#[derive(Clone, Debug, Serialize)]
pub(crate) struct Table {
    pub(crate) name: String,
    pub(crate) chains: Vec<Chain>,
    #[serde(skip)]
    chains_by_name: HashMap<String, usize>,
}

impl Table {
    pub(crate) fn new<S: Into<String>>(name: S) -> Self {
        Self {
            name: name.into(),
            chains: Vec::new(),
            chains_by_name: HashMap::new(),
        }
    }

    pub(crate) fn parse_chain<S: AsRef<str>>(&mut self, line: S) -> Result<()> {
        let chain = Chain::parse_chain(line)?;
        self.chains.push(chain.clone());
        self.chains_by_name.insert(chain.name.clone(), self.chains.len() - 1);
        Ok(())
    }

    pub(crate) fn parse_rule<S: AsRef<str>>(&mut self, line: S) -> Result<()> {
        let (chain, rule) = Rule::parse_rule(line)?;
        let chain_index = self
            .chains_by_name
            .entry(chain.clone())
            .or_insert_with(|| {
                let chain = Chain::new(chain.clone());
                self.chains.push(chain);
                self.chains.len() - 1
            });

        self.chains[*chain_index].rules.push(rule);
        Ok(())
    }
}


