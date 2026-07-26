const repository =
    require("./dashboardRepository");

exports.getDashboard =
async () => {

    return await repository.getDashboard();

};