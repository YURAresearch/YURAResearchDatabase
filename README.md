![banner](/assets/banner.jpg)


Do you want to help students find research? Want to get started with web development? Read the ***Getting Started*** below to learn more!

Master branch deployed at https://yura-rdb.herokuapp.com/

## Getting Started

### Running a local copy of RDB

Prerequisites:
- You've installed `npm`
- You've installed `postgres`

1) Fork the repo on github
2) Do a ` git clone ` to get it onto your local computer
3) `cd YURAResearchDatabase` (*change to the directory*)
4) `npm install`

You won't see anything yet, but it's working. You just need to run the Postgres server as well:

### Setting up the database
In this repo, we've shipped a `yurardb.dump` file, which contains all the data.

In order to transform this file into a Hydrated, Fire-Breathing, Alive+Kicking database that LIves on a Server, we'll need to cast a full `pg_restore` spell.

1) Create a new database (since pg_restore doesn't do this for you)
    -  `createdb -T template0 yurardb_testing`
2) Run the restore
    - `pg_restore -d yurardb_testing yurardb.dump`
3) Test it out
    - `psql`

![psql session](/assets/psql_session1.jpg)

### Running the server
