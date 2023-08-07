/**
 * Mock 接口 - 条形图 
 */
const getBarChart = async (req, res, next) => {
    try {
        console.log('==== Mock 接口 - 条形图 ===')
        const mockData = { "dimensions": ["type", "加班工时", "打卡工时"], "source": [{ "type": "一月", "加班工时": 90, "打卡工时": 130 }, { "type": "二月", "加班工时": 200, "打卡工时": 130 }, { "type": "三月", "加班工时": 150, "打卡工时": 312 }, { "type": "四月", "加班工时": 80, "打卡工时": 268 }, { "type": "五月", "加班工时": 70, "打卡工时": 155 }, { "type": "六月", "加班工时": 110, "打卡工时": 117 }, { "type": "七月", "加班工时": 130, "打卡工时": 160 }] }
        res.sendResponse({
            msg: '操作成功',
            data: mockData
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

/**
 * Mock 接口 - 折线
 */
const getLineChart = async (req, res, next) => {
    try {
        console.log('==== Mock 接口 - 折线 ===')
        const mockData = { "dimensions": ["type", "加班工时", "打卡工时"], "source": [{ "type": "一月", "加班工时": 120, "打卡工时": 130 }, { "type": "二月", "加班工时": 200, "打卡工时": 130 }, { "type": "三月", "加班工时": 150, "打卡工时": 312 }, { "type": "四月", "加班工时": 80, "打卡工时": 268 }, { "type": "五月", "加班工时": 70, "打卡工时": 155 }, { "type": "六月", "加班工时": 110, "打卡工时": 117 }, { "type": "七月", "加班工时": 130, "打卡工时": 160 }] }
        res.sendResponse({
            msg: '操作成功',
            data: mockData
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

/**
 * Mock 接口 - 排名
 */
const getRankChart = async (req, res, next) => {
    try {
        console.log('==== Mock 接口 - 排名 ===')
        const mockData = { "dimensions": ["name", "value"], "source": [{ "name": "质量管理部", "value": 20 }, { "name": "供应链", "value": 40 }, { "name": "计划部", "value": 60 }, { "name": "产品中心", "value": 80 }, { "name": "研发中心", "value": 100 }] }
        res.sendResponse({
            msg: '操作成功',
            data: mockData
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

/**
 * Mock 接口 - 饼图
 */
const getPieChart = async (req, res, next) => {
    try {
        console.log('==== Mock 接口 - 饼图 ===')
        const mockData = { "dimensions": ["type", "data1"], "source": [{ "type": "打卡工时", "data1": 120 }, { "type": "申报工时", "data1": 200 }, { "type": "项目工时", "data1": 150 }, { "type": "平台工时", "data1": 80 }, { "type": "标准工时", "data1": 170 }, { "type": "加班工时", "data1": 110 }] }
        res.sendResponse({
            msg: '操作成功',
            data: mockData
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

/**
 * Mock 接口 - 雷达图
 */
const getRadarChart = async (req, res, next) => {
    try {
        console.log('==== Mock 接口 - 雷达图 ===')
        const mockData = { 
            "radarIndicator": [{ "name": "沟通能力", "max": 650 }, { "name": "协作能力", "max": 1600 }, { "name": "编码能力", "max": 3000 }, { "name": "系统设计能力", "max": 3800 }, { "name": "管理能力", "max": 5200 }, { "name": "学习能力", "max": 2500 }],
            "seriesData": [{ "name": "张三", "value": [200,1200, 1380, 1260,3205, 1805] }, { "name": "李四", "value": [500, 1400, 2800, 2600, 4200, 2100] }] }
        res.sendResponse({
            msg: '操作成功',
            data: mockData
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

module.exports = {
    getBarChart,
    getLineChart,
    getRankChart,
    getPieChart,
    getRadarChart
}
