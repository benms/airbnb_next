import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'
import { useState } from 'react'
import { calcNumberOfNightsBetweenDates } from '../helpers'

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

export default function DateRangePicker({ datesChanged, bookedDates }) {
  const [startDate, setStartDate] = useState(new Date(today))
  const [endDate, setEndDate] = useState(new Date(tomorrow))
  bookedDates = bookedDates.map((date) => new Date(date))

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale })
    return DateUtils.isDate(parsed) ? parsed : null
  }

  const formatDate = (date, format, locale) =>
    dateFnsFormat(date, format, { locale })

  const format = 'dd MMM yyyy'

  return (
    <div className="date-range-picker-container">
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={startDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                ...bookedDates,
                {
                  before: new Date()
                }
              ]
            }
          }}
          onDayChange={day => {
            setStartDate(day)
            const newEndDate = new Date(day)
            if (calcNumberOfNightsBetweenDates(day, endDate) < 1) {
              newEndDate.setDate(newEndDate.getDate() + 1)
              setEndDate(newEndDate)
            }
            datesChanged(day, newEndDate)
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={endDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                startDate,
                ...bookedDates,
                {
                  before: startDate
                }
              ]
            }
          }}
          onDayChange={day => {
            setEndDate(day)
            datesChanged(startDate, day)
          }}
        />
      </div>

      <style jsx>
        {`
          .date-range-picker-container div {
            display: grid;
            grid-template-columns: 30% 70%;
            padding: 10px;
          }
          label {
            padding-top: 10px;
          }
        `}
      </style>
      <style jsx global>
        {`
          .DayPickerInput input {
            width: 120px;
            padding: 10px;
            font-size: 16px;
          }
        `}
      </style>
    </div>
  )
}