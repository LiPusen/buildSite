module.exports = {
	appenders: {
		stdout: { //控制台输出
			type: 'stdout'
		},
		access: {
			type: 'dateFile',
			filename: 'logs/access/access',
			pattern: '-dd.log',
			alwaysIncludePattern: true
		},
		system: {
			type: 'dateFile',
			filename: 'logs/system/system',
			pattern: '-dd.log',
			alwaysIncludePattern: true
		},
		database: {
			type: 'dateFile',
			filename: 'logs/database/database',
			pattern: '-dd.log',
			alwaysIncludePattern: true
		},
		error: {
			type: 'logLevelFilter',
			appender: {
				type: 'dateFile',
				filename: 'logs/errors/error',
				pattern: '-MM-dd.log',
				alwaysIncludePattern: true
			}
		}
	},
	categories: {
		default: {
			appenders: ['stdout', 'error'],
			level: 'debug'
		}, //appenders:采用的appender,取appenders项,level:设置级别
		access: {
			appenders: ['stdout', 'access'],
			level: 'info'
		},
		system: {
			appenders: ['stdout', 'system'],
			level: 'info'
		},
		database: {
			appenders: ['stdout', 'database'],
			level: 'info'
		}
	},
	replaceConsole: true
};