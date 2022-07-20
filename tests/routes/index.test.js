const { registerRoutes } = require("../../src/routes/")
const express = require('express');

describe('testing register routes function',()=>{
	let app = {
		use : jest.fn()
	}
	test('testing register routes',()=>{
		registerRoutes(app);
		expect(app.use).toHaveBeenCalled();
	})
})