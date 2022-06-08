const ReportRouter = require('express').Router();

const ReportControler = require('../controller/report.controller');

ReportRouter.route('/short-report')
    .get(ReportControler.returnShortReport, ReportControler.returnFile);

ReportRouter.route('/medium-report')
    .get(ReportControler.returnMediumReport, ReportControler.returnFile);

ReportRouter.route('/long-report')
    .get(ReportControler.returnLongReport, ReportControler.returnFile);

module.exports = ReportRouter;