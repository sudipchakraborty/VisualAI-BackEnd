const service =
    require("./dashboardService");

exports.getDashboard =
async (req, res) => {

    try {

        const data =
            await service.getDashboard();

        res.json({

            success: true,

            dashboard: data

        });

    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};