// database/postgresTest.js

const db =
require("./postgres");

async function runTests() {

    try {

        console.log(
            "\n======================="
        );

        console.log(
            "POSTGRESQL CRUD TEST"
        );

        console.log(
            "=======================\n"
        );

        /////////////////////////////////////////////////////
        // CREATE TABLE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] CREATE TABLE"
        );

        await db.query(

            `
            CREATE TABLE IF NOT EXISTS inspections (

                id SERIAL PRIMARY KEY,

                datetime TIMESTAMP,

                duration INTEGER,

                product VARCHAR(100),

                phase1 VARCHAR(20),

                phase2 VARCHAR(20),

                phase3 VARCHAR(20)

            )
            `
        );

        console.log(
            "Table Ready"
        );

        /////////////////////////////////////////////////////
        // INSERT
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] INSERT"
        );

        const insertedRow =
        await db.insert(

            "inspections",

            {

                datetime: new Date(),

                duration: 25,

                product: "A2300P",

                phase1: "OK",

                phase2: "OK",

                phase3: "EXCEP"

            }
        );

        console.log(
            insertedRow
        );

        const testId =
        insertedRow.id;

        /////////////////////////////////////////////////////
        // READ ALL
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] READ ALL"
        );

        const rows =
        await db.findAll(
            "inspections"
        );

        console.table(
            rows
        );

        /////////////////////////////////////////////////////
        // READ ONE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] READ ONE"
        );

        const row =
        await db.findById(
            "inspections",
            testId
        );

        console.log(
            row
        );

        /////////////////////////////////////////////////////
        // UPDATE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] UPDATE"
        );

        const updatedRow =
        await db.update(

            "inspections",

            testId,

            {

                duration: 30,

                phase3: "OK"

            }
        );

        console.log(
            updatedRow
        );

        /////////////////////////////////////////////////////
        // VERIFY UPDATE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] VERIFY UPDATE"
        );

        const verify =
        await db.findById(

            "inspections",

            testId
        );

        console.log(
            verify
        );

        /////////////////////////////////////////////////////
        // DELETE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] DELETE"
        );

        const deleted =
        await db.delete(

            "inspections",

            testId
        );

        console.log(
            deleted
        );

        /////////////////////////////////////////////////////
        // VERIFY DELETE
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] VERIFY DELETE"
        );

        const verifyDelete =
        await db.findById(

            "inspections",

            testId
        );

        console.log(
            verifyDelete
        );

        /////////////////////////////////////////////////////
        // CUSTOM QUERY
        /////////////////////////////////////////////////////

        console.log(
            "\n[TEST] CUSTOM QUERY"
        );

        const result =
        await db.query(

            `
            SELECT *
            FROM inspections
            ORDER BY id DESC
            LIMIT 5
            `
        );

        console.table(
            result
        );

        console.log(
            "\nALL TESTS PASSED"
        );

    }
    catch (error) {

        console.error(

            "\nTEST FAILED\n",

            error
        );

    }
    finally {

        await db.close();

    }
}

runTests();