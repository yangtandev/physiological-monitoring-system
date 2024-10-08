const { Op } = require('sequelize');
const {
	Five_minute_hr,
	One_day_hr,
	One_month_hr,
} = require('../models/models');

const api = {
	// Obtain part or all of the user's five-minute average heart rate data.
	read5MinuteHr: async (ctx) => {
		const { user_id, start_time, end_time } = ctx.params;
		try {
			let result;
			if (start_time && end_time) {
				result = await Five_minute_hr.findAll({
					where: {
						user_id: user_id,
						timestamp: { [Op.between]: [start_time, end_time] },
					},
					raw: true,
				});
			} else {
				result = await Five_minute_hr.findAll({
					where: { user_id: user_id },
					raw: true,
				});
			}
			ctx.response.body = result.length > 0 ? result : null;
		} catch (error) {
			ctx.response.body = error;
		}
	},
	// Obtain the user's average heart rate data from the previous day.
	readLatest1DayHr: async (ctx) => {
		const { user_id, start_time, end_time } = ctx.params;
		try {
			let result = await One_day_hr.findOne({
				where: {
					user_id: user_id,
					timestamp: { [Op.between]: [start_time, end_time] },
				},
				order: [['timestamp', 'DESC']],
				raw: true,
			});
			ctx.response.body = result;
		} catch (error) {
			ctx.response.body = error;
		}
	},
	// Obtain the user's average heart rate data for the previous month.
	readLatest1MonthHr: async (ctx) => {
		const { user_id, start_time, end_time } = ctx.params;
		try {
			let result = await One_month_hr.findOne({
				where: {
					user_id: user_id,
					timestamp: { [Op.between]: [start_time, end_time] },
				},
				order: [['timestamp', 'DESC']],
				raw: true,
			});
			ctx.response.body = result;
		} catch (error) {
			ctx.response.body = error;
		}
	},
};

module.exports = api;
