'use strict'

function getData(tmp, key, val, attr) {
	// press -330
	console.log(key, val, attr, '-----getData-------')
	let data = []
	for (let i = 0; i < tmp.length; i++) {
		let item = tmp[i]
		console.log(item[key], '-----------')
		if (item[key] == val) {
			if (attr) {
				data.push(item[attr])
			} else data.push(item)
		}
	}
	return data
}

// 获取json list中每行对象的某个字段（某列）的值，并返回数组
function get_one_col_list(json_list, key) {
	let data = []
	for (let i = 0; i < json_list.length; i++) {
		//检查 key 是否包含在 json对象的key中
		if (i == 0) {
			let _keys = Object.keys(json_list[i])
			if (!_keys.includes(key)) {
				console.log(`要查找的key【${key}】在json对象的key【${_keys.join(',')}}】中不存！`)
				return data
			}
		}
		let item = json_list[i]
		data.push(item[key])
	}
	return data
}

async function chart_line1(params, data) {
	let { xaxis_field, series_list = [] } = params
	let chart_data = {}
	let legend = []
	let xData = (await get_one_col_list(data, xaxis_field)) || []

	let series = []
	for (let j = 0; j < series_list.length; j++) {
		let sub = series_list[j]
		let _legend_name = sub.legend
		let _legend_field = sub.series_field
		legend.push(_legend_name)
		let _data = (await get_one_col_list(data, _legend_field)) || []

		series.push({
			name: _legend_name,
			type: 'line',
			itemStyle: { normal: { label: { show: true } } }, // 显示数值
			// stack: '总量',
			areaStyle: {},
			data: _data
		})
	}
	chart_data.xData = xData || []
	chart_data.legend = legend
	chart_data.series = series
	return chart_data
}

async function chart_line2(params, data) {
	let { legend_field, legend_sub, xaxis_field, series_field } = params
	let chart_data = {}
	let legend = []
	let xData = []
	legend_sub = legend_sub || []
	for (let i = 0; i < data.length; i++) {
		let item = data[i]
		// console.log(item, '----chart_line------')
		if (legend_sub.length == 0) {
			legend.push(item[legend_field])
		} else {
			for (let x = 0; x < legend_sub.length; x++) {
				let sub = legend_sub[x]
				legend.push(item[legend_field] + sub.legend)
			}
		}
		xData.push(item[xaxis_field])
	}
	legend = Array.from(new Set(legend))
	xData = Array.from(new Set(xData))

	console.log(legend, '------legend-------')
	console.log(xData, '-------xData------')
	let series = []
	for (let j = 0; j < legend.length; j++) {
		let _legend = legend[j]
		let _data = []
		//单个取值
		if (legend_sub.length == 0) {
			_data = (await getData(data, legend_field, _legend, series_field)) || []
			series.push({
				name: _legend,
				type: 'line',
				itemStyle: { normal: { label: { show: true } } }, // 显示数值
				// stack: '总量',
				areaStyle: {},
				data: _data
			})
		} else {
			for (let x = 0; x < legend_sub.length; x++) {
				let sub = legend_sub[x]
				let sub_legend = sub.legend
				let sub_series_field = sub.series_field
				if (_legend.indexOf(sub_legend) >= 0) {
					_data = (await getData(data, legend_field, _legend.replace(sub_legend, ''), sub_series_field)) || []
					series.push({
						name: _legend,
						type: 'line',
						itemStyle: { normal: { label: { show: true } } }, // 显示数值
						// stack: '总量',
						areaStyle: {},
						data: _data
					})
				}
			}
		}
	}
	chart_data.xData = xData || []
	chart_data.legend = legend || []
	chart_data.series = series || []
	return chart_data
}

async function chart_bar(params, data) {
	let { legend_field, xaxis_field, series_field, labelOption } = params
	let chart_data = {}

	let legend = []
	let xData = []
	for (let i = 0; i < data.length; i++) {
		let item = data[i]
		legend.push(item[legend_field])
		xData.push(item[xaxis_field])
	}
	legend = Array.from(new Set(legend))
	xData = Array.from(new Set(xData))
	let series = []
	for (let j = 0; j < legend.length; j++) {
		let _legend = legend[j]
		let _data = (await getData(data, legend_field, _legend, series_field)) || []
		series.push({
			name: _legend,
			type: 'bar',
			barGap: 0,
			label: labelOption,
			// stack: '总量',
			data: _data
		})
	}
	chart_data.xData = xData || []
	chart_data.legend = legend || []
	chart_data.series = series || []
	return chart_data
}

async function chart_pie(params, data) {
	let { legend_field, xaxis_field, series_field, labelOption } = params
	let chart_data = {}

	let legend = []
	let xData = []
	for (let i = 0; i < data.length; i++) {
		let item = data[i]
		legend.push(item[legend_field])
		xData.push(item[xaxis_field])
	}
	legend = Array.from(new Set(legend))
	xData = Array.from(new Set(xData))
	let series = []
	for (let j = 0; j < legend.length; j++) {
		let _legend = legend[j]
		let _data = (await getData(data, legend_field, _legend, series_field)) || []
		series.push({
			name: _legend,
			type: 'bar',
			barGap: 0,
			label: labelOption,
			// stack: '总量',
			data: _data
		})
	}
	chart_data.xData = xData || []
	chart_data.legend = legend || []
	chart_data.series = series || []
	return chart_data
}


module.exports = {
	chart_line1: chart_line1,
	chart_line2: chart_line2,
	chart_bar: chart_bar,
	chart_pie: chart_pie
}
