const db = require("../database/postgres");

exports.getDashboard = async () => {

    const sql = `

        SELECT

            COUNT(*)::integer AS "totalInspection",

            COUNT(*) FILTER (
                WHERE status = 'PASS'
            )::integer AS pass,

            COUNT(*) FILTER (
                WHERE status = 'FAIL'
            )::integer AS fail,

            COALESCE(
                ROUND(
                    AVG(confidence)::numeric,
                    2
                ),
                0
            )::double precision AS confidence

        FROM inspection_records;

    `;

    const rows = await db.query(sql);

    return rows[0];

};
