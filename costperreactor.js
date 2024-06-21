let countries = ["Canada","France","India","Japan","S Korea", "USA","W Germany"]

let reactorcostdata = [
    {
        "country": "Canada",
        "year": [1966, 1967, 1971, 1972, 1973, 1974, 1975, 1976, 1976, 1977, 1977, 1978, 1988, 1989, 1974, 1975, 1983, 1984, 1985, 1986, 1974, 1974],
        "cost": [2700, 2700, 2400, 2400, 2400, 2400, 2700, 2700, 2700, 2700, 2600, 2600, 2600, 2600, 3500, 3500, 3900, 3900, 3900, 3900, 1400, 1350]
    },
    { "country": "France", "year": [1973, 1973, 1974, 1974, 1975, 1975, 1975, 1975, 1976, 1975, 1975, 1975, 1976, 1976, 1977, 1977, 1976, 1977, 1977, 1978, 1978, 1978, 1978, 1979, 1979, 1979, 1979, 1992, 1988, 1984, 1986, 1979, 1979, 1980, 1980, 1980, 1980, 1980, 1982, 1982, 1983, 1983, 1985, 1983, 1983, 1985, 1985], "cost": [1300, 1300, 1350, 1350, 1350, 1200, 1300, 1300, 1300, 1800, 1850, 1900, 1700, 1700, 1800, 1850, 2300, 2300, 1700, 1900, 1900, 1700, 1700, 1600, 1600, 1450, 1450, 1900, 1900, 2500, 2500, 1950, 2050, 1950, 2050, 1700, 1700, 1700, 1700, 1800, 1800, 1600, 1600, 1900, 1950, 1900, 1950] },
    { "country": "India", "year": [1965, 1968, 1966, 1971, 1973, 1977, 1978, 1985, 1985, 1989, 1990, 1990, 1991, 2000, 2000, 2003, 2003, 2003, 2004, 2004], "cost": [1000, 1000, 1350, 800, 800, 2000, 2000, 2050, 2050, 2350, 2350, 2200, 2200, 1900, 1900, 2000, 2000, 2000, 1900, 1900] },
    { "country": "Japan", "year": [1967, 1967, 1967, 1969, 1966, 1967, 1966, 1970, 1970, 1971, 1971, 1973, 1971, 1973, 1973, 1973, 1974, 1974, 1974, 1974, 1976, 1976, 1978, 1978, 1982, 1982, 1984, 1987, 1986, 1980, 1982, 1981, 1984, 1985, 1985, 1984, 1985, 1981, 1981, 1985, 1989, 1987, 2001, 2005, 2003, 2001, 1987, 1988, 1989, 1990, 1990, 1991, 1992, 1994, 1994, 1993], "cost": [1950, 1950, 1900, 1500, 3900, 3050, 2300, 1700, 1800, 1300, 1300, 1700, 1700, 1600, 1500, 2100, 2450, 2050, 2100, 2000, 3800, 3850, 1977, 2950, 2800, 3000, 3000, 2250, 3000, 3700, 3300, 3700, 3650, 3500, 3400, 4100, 4100, 4800, 5000, 5500, 5700, 4800, 4300, 3850, 3050, 2950, 4200, 3500, 3000, 3100, 3500, 3650, 3250, 3150, 2800, 2700] },
    { "country": "S Korea", "year": [1973, 1977, 1977, 1979, 1980, 1982, 1983, 1984, 1984, 1990, 1990, 1993, 1995, 1995, 1994, 1994, 1997, 1997, 2000, 2001, 2007, 2008, 2008, 2009, 2009], "cost": [3500, 3950, 3900, 2250, 2250, 2700, 2700, 2700, 2700, 2300, 2300, 2900, 2900, 2900, 2050, 2050, 1700, 1700, 1950, 1950, 2000, 2000, 2000, 2000, 1800] },
    { "country": "USA", "year": [1967, 1967, 1967, 1967, 1967, 1967, 1968, 1968, 1969, 1966, 1966, 1966, 1967, 1967, 1968, 1967, 1968, 1968, 1964, 1964, 1965, 1966, 1966, 1966, 1967, 1967, 1968, 1968, 1969, 1967, 1967, 1967, 1967, 1967, 1968, 1969, 1968, 1967, 1969, 1970, 1970, 1970, 1974, 1976, 1976, 1974, 1976, 1975, 1977, 1974, 1975, 1973, 1977, 1978, 1975, 1974, 1968, 1965, 1979, 1966, 1971, 1976, 1976, 1976, 1974, 1975, 1975, 1975, 1976, 1977, 1974, 1974, 1977, 1972, 1972, 1973, 1971, 1970, 1971, 1971, 1970, 1970, 1975, 1974, 1974, 1975, 1976, 1975, 1976, 1977], "cost": [700, 750, 750, 800, 800, 900, 800, 900, 900, 1050, 1000, 1000, 1000, 1050, 950, 1000, 1000, 1200, 1400, 1500, 1300, 1200, 1200, 1200, 1200, 1300, 1300, 1350, 1350, 1500, 1500, 1500, 1550, 1650, 1700, 1700, 1800, 1500, 1600, 1700, 1500, 1500, 10900, 8700, 8200, 8050, 7850, 7300, 7400, 7000, 6500, 6050, 6000, 5800, 5600, 5500, 2200, 2500, 2300, 4100, 4200, 5200, 5100, 5000, 4950, 4950, 4700, 4650, 4300, 4100, 3950, 3850, 3600, 1700, 1700, 1800, 1950, 2050, 2050, 2150, 2400, 2500, 2500, 2600, 3300, 3400, 3300, 3200, 3500, 3600] },
    { "country": "W Germany", "year": [1964, 1965, 1965, 1965, 1966, 1970, 1973, 1975, 1983, 1983, 1983, 1976, 1978, 1977, 1978, 1974, 1975, 1970, 1971, 1973, 1974, 1974], "cost": [1650, 1500, 1400, 3500, 1500, 1800, 1000, 3900, 4000, 3300, 3300, 2900, 2900, 2700, 2700, 2050, 2050, 1900, 1600, 1400, 1400, 1250] }
]