import React, { ChangeEvent, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectReportMeta, selectSettings } from '../abcSlice';
import { Refresh } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { TReportType } from '../types/TReportType';
import { TReportPeriodType } from '../types/TReportPeriodType';
import { TSlicePeriod } from '../types/TSlicePeriod';
import { TReportABCSettings } from '../types/TReportABCSettings';

type Props = {
  onApply: (settings: TReportABCSettings) => void;
  onExport: () => void;
  onChange: () => void;
  onReset: () => void;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ReportSettings = (props: Props): JSX.Element => {
  const settings = useAppSelector(selectSettings);
  const reportMeta = useAppSelector(selectReportMeta);

  const [currentSettings, setCurrentSettings] =
    useState<TReportABCSettings>(settings);

  const formattedReportPeriodDate: {
    start: string | boolean;
    end: string | boolean;
  } = useMemo(() => {
    return {
      start:
        !!reportMeta.period.start &&
        reportMeta.period.start.toLocaleDateString('ru-RU'),
      end:
        !!reportMeta.period.end &&
        reportMeta.period.end.toLocaleDateString('ru-RU'),
    };
  }, [reportMeta]);

  const handleChangeReportType = (e: SelectChangeEvent<TReportType>) => {
    setCurrentSettings((prev) => ({
      ...prev,
      type: e.target.value as TReportType,
    }));
    props.onChange();
  };

  const handleChangeSimplePeriodType = (
    e: SelectChangeEvent<TReportPeriodType>
  ) => {
    setCurrentSettings((prev) => ({
      ...prev,
      simple: {
        ...prev.simple,
        periodType: e.target.value as TReportPeriodType,
      },
    }));
    props.onChange();
  };

  const handleChangeSlicePeriodType = (e: SelectChangeEvent<TSlicePeriod>) => {
    setCurrentSettings((prev) => ({
      ...prev,
      simple: {
        ...prev.simple,
        slicePeriodType: e.target.value as TSlicePeriod,
      },
    }));
    props.onChange();
  };

  const handleChangeCountPeriods = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSettings((prev) => ({
      ...prev,
      simple: {
        ...prev.simple,
        countSlicePeriods: +e.target.value,
      },
    }));
    props.onChange();
  };

  const handleChangeDate = (key: 'start' | 'end') => (value: Date | null) => {
    setCurrentSettings((prev) => ({
      ...prev,
      simple: {
        ...prev.simple,
        [key]: value,
      },
    }));
    props.onChange();
  };

  const handleChangeComparativeDate =
    (pos: 'periodLeft' | 'periodRight', key: 'start' | 'end') =>
    (value: Date | null) => {
      setCurrentSettings((prev) => ({
        ...prev,
        comparative: {
          ...prev.comparative,
          [pos]: {
            ...prev.comparative[pos],
            [key]: value || undefined,
          },
        },
      }));
      props.onChange();
    };

  const onApply = () => {
    props.onApply(currentSettings);
  };

  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography variant={'subtitle1'} component={'div'}>
            {formattedReportPeriodDate.start && formattedReportPeriodDate.end
              ? `?????????????????? ???????????? ???? ????????????: ${formattedReportPeriodDate.start} - ${formattedReportPeriodDate.end}`
              : '???????????? ???????????? ???? ??????????????????'}
          </Typography>
          <Typography variant={'subtitle1'} component={'div'}>
            ??????????????: {reportMeta.rows}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={'outlined'}
            color={'primary'}
            size={'small'}
            fullWidth={true}
            onClick={props.onExport}
          >
            ??????????????
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={'outlined'}
            color={'error'}
            size={'small'}
            startIcon={<Refresh />}
            fullWidth={true}
            onClick={props.onReset}
          >
            ??????????
          </Button>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth={true} size={'small'}>
            <InputLabel id="report-type-helper-label">?????? ????????????</InputLabel>
            <Select
              labelId="report-type-helper-label"
              id="report-type-helper"
              value={currentSettings.type}
              label="?????? ????????????"
              onChange={handleChangeReportType}
              fullWidth={true}
            >
              <MenuItem value="simple">??????????????</MenuItem>
              <MenuItem value={'comparative'}>??????????????????????????</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {currentSettings.type === 'simple' && (
          <Grid item xs={7} sx={{ display: 'flex', gap: '8px' }}>
            <FormControl
              fullWidth={true}
              size={'small'}
              sx={{ maxWidth: '350px' }}
            >
              <InputLabel id="report-period-helper-label">????????????</InputLabel>
              <Select
                labelId="report-period-helper-label"
                id="report-period-helper"
                value={currentSettings.simple.periodType}
                label="????????????"
                onChange={handleChangeSimplePeriodType}
              >
                <MenuItem value="current-month">?????????????? ??????????</MenuItem>
                <MenuItem value="current-quart">?????????????? ??????????????</MenuItem>
                <MenuItem value="current-year">?????????????? ??????</MenuItem>
                <MenuItem value="last-month">?????????????? ??????????</MenuItem>
                <MenuItem value="last-quart">?????????????? ??????????????</MenuItem>
                <MenuItem value="last-year">?????????????? ??????</MenuItem>
                {/*<MenuItem value="sliding">???????????????????? ????????????</MenuItem>*/}
                <MenuItem value="custom">????????????????????????</MenuItem>
              </Select>
            </FormControl>
            {currentSettings.simple.periodType === 'sliding' && (
              <>
                <FormControl fullWidth={true} size={'small'}>
                  <InputLabel id="report-slice-period-helper-label">
                    ????????????????
                  </InputLabel>
                  <Select
                    labelId="report-slice-period-helper-label"
                    id="report-slice-period-helper"
                    value={currentSettings.simple.slicePeriodType}
                    label="????????????????"
                    onChange={handleChangeSlicePeriodType}
                  >
                    <MenuItem value="month">??????????</MenuItem>
                    <MenuItem value="quart">??????????????</MenuItem>
                    <MenuItem value="year">??????</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth={true} size={'small'}>
                  <TextField
                    label="???????????????????? ????????????????????"
                    id="sliding-count-intervals"
                    value={currentSettings.simple.countSlicePeriods}
                    onChange={handleChangeCountPeriods}
                    size="small"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                </FormControl>
              </>
            )}
            {currentSettings.simple.periodType === 'custom' && (
              <>
                <DatePicker
                  mask={'__.__.____'}
                  label="????????????"
                  value={currentSettings.simple.start}
                  minDate={reportMeta.period.start}
                  maxDate={reportMeta.period.end}
                  onChange={handleChangeDate('start')}
                  renderInput={(params: TextFieldProps) => (
                    <TextField size={'small'} fullWidth={true} {...params} />
                  )}
                />
                <DatePicker
                  mask={'__.__.____'}
                  label="??????????"
                  value={currentSettings.simple.end}
                  minDate={reportMeta.period.start}
                  maxDate={reportMeta.period.end}
                  onChange={handleChangeDate('end')}
                  renderInput={(params: TextFieldProps) => (
                    <TextField size={'small'} fullWidth={true} {...params} />
                  )}
                />
              </>
            )}
          </Grid>
        )}
        {currentSettings.type === 'comparative' && (
          <Grid item xs={7} sx={{ display: 'flex', gap: '8px' }}>
            <DatePicker
              mask={'__.__.____'}
              label="???????????? ???????????????? 1"
              value={currentSettings.comparative.periodLeft.start}
              minDate={reportMeta.period.start}
              maxDate={reportMeta.period.end}
              onChange={handleChangeComparativeDate('periodLeft', 'start')}
              renderInput={(params: TextFieldProps) => (
                <TextField size={'small'} fullWidth={true} {...params} />
              )}
            />
            <DatePicker
              mask={'__.__.____'}
              label="?????????? ???????????????? 1"
              value={currentSettings.comparative.periodLeft.end}
              minDate={reportMeta.period.start}
              maxDate={reportMeta.period.end}
              onChange={handleChangeComparativeDate('periodLeft', 'end')}
              renderInput={(params: TextFieldProps) => (
                <TextField size={'small'} fullWidth={true} {...params} />
              )}
            />
            <DatePicker
              mask={'__.__.____'}
              label="???????????? ???????????????? 2"
              value={currentSettings.comparative.periodRight.start}
              minDate={reportMeta.period.start}
              maxDate={reportMeta.period.end}
              onChange={handleChangeComparativeDate('periodRight', 'start')}
              renderInput={(params: TextFieldProps) => (
                <TextField size={'small'} fullWidth={true} {...params} />
              )}
            />
            <DatePicker
              mask={'__.__.____'}
              label="?????????? ???????????????? 2"
              value={currentSettings.comparative.periodRight.end}
              minDate={reportMeta.period.start}
              maxDate={reportMeta.period.end}
              onChange={handleChangeComparativeDate('periodRight', 'end')}
              renderInput={(params: TextFieldProps) => (
                <TextField size={'small'} fullWidth={true} {...params} />
              )}
            />
          </Grid>
        )}
        <Grid item xs={2}>
          <Button
            variant={'contained'}
            color={'primary'}
            fullWidth={true}
            onClick={onApply}
          >
            ????????????????????????
          </Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default ReportSettings;
