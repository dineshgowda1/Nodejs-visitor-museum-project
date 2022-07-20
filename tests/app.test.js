
let bodyParser = require('body-parser'); 
let { registerRoutes } = require('../src/routes/')
let config = require('config');
const mockApp = {
  use: jest.fn(),
  listen: jest.fn().mockImplementation(()=>{ return { close : jest.fn()}} )
}

jest.doMock('express', () => {
  return () => {
    return mockApp
  }
})


let app = require("../src/app");
let express = require('express');

describe('testing server driver code',() => {

	const bodyParserMock = {
		json: jest.fn(),
		urlencoded: jest.fn()
	}

	beforeEach(() => {
		bodyParser = jest.fn().mockReturnValue(bodyParserMock);
		registerRoutes = jest.fn(),
		config = jest.fn()
	})

	test('start server should work properly', async () => {
		await app.startServer()
		expect(mockApp.listen).toHaveBeenCalled();
	})

	test('stop server should work properly', async() => {
		await app.stopServer();
	})

	test('testing exception in starter code', async()=>{
		mockApp.listen.mockRejectedValue(new Error("some error"));
		await expect(app.startServer()).rejects.toThrowError("some error")
	})
})