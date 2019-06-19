import React from 'react';
import '../style/DateTimeRange.css';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import MonthYearSelector from './MonthYearSelector';
import CalendarHeader from './CalendarHeader';
import CalendarRows from './CalendarRows';
import { createYears } from '../utils/YearUtils';
import {
  getMonth,
  getYear,
  getFourtyTwoDays,
} from '../utils/TimeFunctionUtils';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 0,
      year: 0,
    };

    this.changeMonthCallback = this.changeMonthCallback.bind(this);
    this.changeYearCallback = this.changeYearCallback.bind(this);
    this.changeMonthArrowsCallback = this.changeMonthArrowsCallback.bind(this);
  }

  componentDidMount() {
    this.updateMonthYear();
  }

  componentDidUpdate(previousProps) {
    if (
      !previousProps.date.isSame(this.props.date) ||
      !previousProps.otherDate.isSame(this.props.otherDate)
    ) {
      this.updateMonthYear();
    }
  }

  updateMonthYear() {
    let newMonth = getMonth(
      this.props.date,
      this.props.otherDate,
      this.props.mode,
    );
    let newYear = getYear(
      this.props.date,
      this.props.otherDate,
      this.props.mode,
    );
    this.setState({
      month: newMonth,
      year: newYear,
    });
  }

  createMonths() {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months;
  }

  changeMonthCallback(event) {
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].value === event.target.value) {
        this.setState({ month: i });
      }
    }
  }

  changeMonthArrowsCallback(isPreviousChange, isNextChange) {
    let years = createYears(this.props.years, this.props.descendingYears);
    let monthLocal = parseInt(this.state.month);
    let yearLocal = parseInt(this.state.year);

    let newMonthYear;
    if (isPreviousChange) {
      newMonthYear = this.getPreviousMonth(monthLocal, yearLocal, years);
    }
    if (isNextChange) {
      newMonthYear = this.getNextMonth(monthLocal, yearLocal, years);
    }

    this.setState({
      year: newMonthYear.yearLocal,
      month: newMonthYear.monthLocal,
    });
  }

  getPreviousMonth(monthLocal, yearLocal, years) {
    let isStartOfMonth = monthLocal === 0;
    let isFirstYear = parseInt(yearLocal) === years[0];

    if (!(isStartOfMonth && isFirstYear)) {
      if (monthLocal === 0) {
        monthLocal = 11;
        yearLocal -= 1;
      } else {
        monthLocal -= 1;
      }
    }
    return { monthLocal, yearLocal };
  }

  getNextMonth(monthLocal, yearLocal, years) {
    let isEndOfMonth = monthLocal === 11;
    let isLastYear = parseInt(yearLocal) === years[years.length - 1];
    if (!(isEndOfMonth && isLastYear)) {
      if (monthLocal === 11) {
        monthLocal = 0;
        yearLocal += 1;
      } else {
        monthLocal += 1;
      }
    }
    return { monthLocal, yearLocal };
  }

  changeYearCallback(event) {
    this.setState({ year: parseInt(event.target.value) });
  }

  render() {
    let months = this.createMonths();
    let years = createYears(this.props.years, this.props.descendingYears);
    let headers;
    let sundayFirst;
    if (this.props.local && this.props.local.sundayFirst) {
      sundayFirst = true;
      headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    } else {
      sundayFirst = false;
      headers = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    }

    let fourtyTwoDays = getFourtyTwoDays(
      this.state.month,
      this.state.year,
      sundayFirst,
    );
    return (
      <div>
        <MonthYearSelector
          months={months}
          years={years}
          month={this.state.month}
          year={this.state.year}
          changeMonthCallback={this.changeMonthCallback}
          changeYearCallback={this.changeYearCallback}
          changeMonthArrowsCallback={this.changeMonthArrowsCallback}
        />
        <CalendarHeader headers={headers} />
        <CalendarRows
          fourtyTwoDays={fourtyTwoDays}
          date={this.props.date}
          mode={this.props.mode}
          otherDate={this.props.otherDate}
          maxDate={this.props.maxDate}
          month={this.state.month}
          year={this.state.year}
          dateSelectedNoTimeCallback={this.props.dateSelectedNoTimeCallback}
          keyboardCellCallback={this.props.keyboardCellCallback}
          focusOnCallback={this.props.focusOnCallback}
          focusDate={this.props.focusDate}
          cellFocusedCallback={this.props.cellFocusedCallback}
        />
      </div>
    );
  }
}

Calendar.propTypes = {
  date: momentPropTypes.momentObj,
  mode: PropTypes.string.isRequired,
  otherDate: momentPropTypes.momentObj,
  maxDate: momentPropTypes.momentObj,
  dateSelectedNoTimeCallback: PropTypes.func.isRequired,
  keyboardCellCallback: PropTypes.func.isRequired,
  focusOnCallback: PropTypes.func.isRequired,
  focusDate: PropTypes.any.isRequired,
  descendingYears: PropTypes.bool,
  years: PropTypes.array,
  cellFocusedCallback: PropTypes.func.isRequired,
  local: PropTypes.object,
};
export default Calendar;
