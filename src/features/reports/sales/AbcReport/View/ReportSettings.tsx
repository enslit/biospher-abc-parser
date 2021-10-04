import React, { ChangeEvent, useMemo } from 'react';
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
import {
  reset,
  selectReportMeta,
  selectSettings,
  setSettingsPeriodType,
  setSettingsPeriodDate,
  setSettingsType,
  setSettingsSlidingPeriod,
  setSettingsSlidingPeriodsCount,
} from '../abcSlice';
import { Refresh } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { TReportType } from '../types/TReportType';
import { TReportPeriodType } from '../types/TReportPeriodType';
import { TSlicePeriod } from '../types/TSlicePeriod';

type Props = {
  onApply: () => void;
  onExport: () => void;
  onChange: () => void;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ReportSettings = (props: Props): JSX.Element => {
  const settings = useAppSelector(selectSettings);
  const reportMeta = useAppSelector(selectReportMeta);
  const dispatch = useAppDispatch();

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
    dispatch(setSettingsType(e.target.value as TReportType));
    props.onChange();
  };

  const handleChangePeriodType = (e: SelectChangeEvent<TReportPeriodType>) => {
    dispatch(setSettingsPeriodType(e.target.value as TReportPeriodType));
    props.onChange();
  };

  const handleChangeSlicePeriodType = (e: SelectChangeEvent<TSlicePeriod>) => {
    dispatch(setSettingsSlidingPeriod(e.target.value as TSlicePeriod));
    props.onChange();
  };

  const handleChangeCountPeriods = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSettingsSlidingPeriodsCount(+e.target.value));
    props.onChange();
  };

  const handleChangeDate = (key: 'start' | 'end') => (value: Date | null) => {
    dispatch(setSettingsPeriodDate({ key, value }));
    props.onChange();
  };

  const onReset = () => {
    dispatch(reset());
    props.onChange();
  };

  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography variant={'subtitle1'} component={'div'}>
            {formattedReportPeriodDate.start && formattedReportPeriodDate.end
              ? `Загружены данные за период: ${formattedReportPeriodDate.start} - ${formattedReportPeriodDate.end}`
              : 'Период отчета не определен'}
          </Typography>
          <Typography variant={'subtitle1'} component={'div'}>
            Заказов: {reportMeta.rows}
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
            Экспорт
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={'outlined'}
            color={'error'}
            size={'small'}
            startIcon={<Refresh />}
            fullWidth={true}
            onClick={onReset}
          >
            Сброс
          </Button>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth={true} size={'small'}>
            <InputLabel id="report-type-helper-label">Тип отчета</InputLabel>
            <Select
              labelId="report-type-helper-label"
              id="report-type-helper"
              value={settings.type}
              label="Тип отчета"
              onChange={handleChangeReportType}
              fullWidth={true}
            >
              <MenuItem value="simple">Простой</MenuItem>
              <MenuItem value={'comparative'}>Сравнительный</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7} sx={{ display: 'flex', gap: '8px' }}>
          <FormControl
            fullWidth={true}
            size={'small'}
            sx={{ maxWidth: '350px' }}
          >
            <InputLabel id="report-period-helper-label">Период</InputLabel>
            <Select
              labelId="report-period-helper-label"
              id="report-period-helper"
              value={settings.periodType}
              label="Период"
              onChange={handleChangePeriodType}
            >
              <MenuItem value="current-month">Текущий месяц</MenuItem>
              <MenuItem value="current-quart">Текущий квартал</MenuItem>
              <MenuItem value="current-year">Текущий год</MenuItem>
              <MenuItem value="last-month">Прошлый месяц</MenuItem>
              <MenuItem value="last-quart">Прошлый квартал</MenuItem>
              <MenuItem value="last-year">Прошлый год</MenuItem>
              {/*<MenuItem value="sliding">Скользящий период</MenuItem>*/}
              <MenuItem value="custom">Произвольный</MenuItem>
            </Select>
          </FormControl>
          {settings.periodType === 'sliding' && (
            <>
              <FormControl fullWidth={true} size={'small'}>
                <InputLabel id="report-slice-period-helper-label">
                  Интервал
                </InputLabel>
                <Select
                  labelId="report-slice-period-helper-label"
                  id="report-slice-period-helper"
                  value={settings.slicePeriodType}
                  label="Интервал"
                  onChange={handleChangeSlicePeriodType}
                >
                  <MenuItem value="month">Месяц</MenuItem>
                  <MenuItem value="quart">Квартал</MenuItem>
                  <MenuItem value="year">Год</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth={true} size={'small'}>
                <TextField
                  label="Количество интервалов"
                  id="sliding-count-intervals"
                  value={settings.countSlicePeriods}
                  onChange={handleChangeCountPeriods}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </FormControl>
            </>
          )}
          {settings.periodType === 'custom' && (
            <>
              <DatePicker
                mask={'__.__.____'}
                label="Начало"
                value={settings.start}
                minDate={reportMeta.period.start}
                maxDate={reportMeta.period.end}
                onChange={handleChangeDate('start')}
                renderInput={(params: TextFieldProps) => (
                  <TextField size={'small'} fullWidth={true} {...params} />
                )}
              />
              <DatePicker
                mask={'__.__.____'}
                label="Конец"
                value={settings.end}
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
        <Grid item xs={2}>
          <Button
            variant={'contained'}
            color={'primary'}
            fullWidth={true}
            onClick={props.onApply}
          >
            Сформировать
          </Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default ReportSettings;
