import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TablePagination,
} from '@material-ui/core';

import logHttpClient from '@zougui/log-http-client';

import { useStyles } from './LogTable.styles';
import { LoadingLogTable } from './LoadingLogTable';
import { Log } from '../Log';

const usePagination = (options: UsePaginationOptions = {}) => {
  const [page, setPage] = useState(options.page ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState(options.rowsPerPage ?? 50);

  const onSetPage = (newPage: number) => {
    setPage(newPage);
  }

  const onSetRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }

  return {
    page,
    rowsPerPage,
    setPage: onSetPage,
    setRowsPerPage: onSetRowsPerPage,
  };
}

interface UsePaginationOptions {
  page?: number;
  rowsPerPage?: number;
}

const usePaginatedLogs = (page: number, pageSize: number) => {
  return useQuery(['logs', page, pageSize], () => logHttpClient.getLogs({ pagination: { page, pageSize } }), { keepPreviousData: true });
}

export const LogTable = () => {
  const classes = useStyles();
  const { page, setPage, rowsPerPage, setRowsPerPage } = usePagination({ rowsPerPage: 50 });
  const query = usePaginatedLogs(page, rowsPerPage);

  const logs = query.data?.data.slice(0, 20) || [];
  //const logs = query.data?.data.filter((l: any) => l.transaction?.id).slice(0, 10) || [];
  //const logs = query.data?.data.slice(1, 2) || [];

  const onPageChange = (e: unknown, newPage: number) => {
    setPage(newPage)
  }

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value))
  }

  if (query.isLoading) {
    return <LoadingLogTable />;
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableBody className={classes.body}>
            {logs.map(log => (
              <TableRow key={log.logId} className={classes.row}>
                <td className={classes.cell}>
                  <Log log={log as any} />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[10, 50, 100]}
        count={52}
        component="div"
        labelRowsPerPage="Logs per page:"
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
