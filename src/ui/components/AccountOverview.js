// @flow

import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {type Account} from "../../ledger/ledger";
import {type CurrencyDetails} from "../../api/currencyConfig";
import * as G from "../../ledger/grain";
import {useLedger} from "../utils/LedgerContext";
import {makeStyles} from "@material-ui/core/styles";

type OverviewProps = {|+currency: CurrencyDetails|};

const useStyles = makeStyles(() => {
  return {
    container: {
      maxHeight: "40em",
    },
  };
});

export const AccountOverview = ({
  currency: {suffix: currencySuffix},
}: OverviewProps) => {
  const {ledger} = useLedger();
  const classes = useStyles();

  const accounts = ledger.accounts();

  function comparator(a: Account, b: Account) {
    if (a.balance === b.balance) {
      return 0;
    }
    return G.gt(a.paid, b.paid) ? -1 : 1;
  }

  const sortedAccounts = accounts.slice().sort(comparator);
  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Active?</TableCell>
            <TableCell align="right">Current Balance</TableCell>
            <TableCell align="right">Grain Earned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAccounts.map((a) => AccountRow(a, currencySuffix))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AccountRow = (account: Account, suffix: string) => (
  <TableRow key={account.identity.id}>
    <TableCell component="th" scope="row">
      {account.identity.name}
    </TableCell>
    <TableCell align="right">{account.active ? "✅" : "🛑"}</TableCell>
    <TableCell align="right">{G.format(account.balance, 2, suffix)}</TableCell>
    <TableCell align="right">{G.format(account.paid, 2, suffix)}</TableCell>
  </TableRow>
);
