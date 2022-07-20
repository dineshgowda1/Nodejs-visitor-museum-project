# Assembly Assignment

## Configuration
1) Add serverPort in under environment file in config folder(port on which server will run)

## Requirements

```bash
NODEJS v6.0+
```

## Install dependencies

```bash
npm install
```

## Usage

```
# set node environment. By default currently, it is set to PROD. Example PROD, STAGE etc
Remember to the config file for that environment in config folder

NODE_ENV=PROD

# Start the application
npm start

# Run the test cases

npm run test

```

## API

```
URL - /api/visitors?date=1404198000000&ignore=america_tropical_interpretive_center

date :  month for which visitor count needs to be fetched in milliseconds

ignore : museum to be ignored

Sample Request - localhost:8090/api/visitors?date=1404198000000&ignore=america_tropical_interpretive_center

Sample Response - 

{
    "attendance": {
        "month": "July",
        "year": 2014,
        "highest": {
            "vistor": 32378,
            "museum": "avila_adobe"
        },
        "lowest": {
            "vistor": 120,
            "museum": "hellman_quon"
        },
        "ignore": {
            "museum": "america_tropical_interpretive_center",
            "visitor": 13490
        },
        "total": 47045
    }
}

```

## CURL

```
curl --location --request GET 'localhost:8090/api/visitors?date=1404198000000&ignore=america_tropical_interpretive_center'
```