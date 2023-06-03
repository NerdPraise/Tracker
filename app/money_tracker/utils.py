import datetime

from constants.utils import Month


def parse_date(date):
    if isinstance(date, str):
        return Month.from_string(date)
    elif isinstance(date, datetime.datetime):
        return Month.from_date(date)
    else:
        return None
