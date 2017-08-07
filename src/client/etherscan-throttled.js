/**
 * @file Throttled interface to Etherscan API client.
 * @module client/etherscan-throttled
 */

'use strict'

// Imports
const RawClient = require('./etherscan')
const Bottleneck = require('bottleneck')

/**
 * Private members store.
 * @private
 */
const privs = new WeakMap()

/**
 * Modules configuration.
 * @private
 */
const moduleConfig = {

  /**
   * 5 requests per second.
   * Unlimited queue size.
   */
  bottleneck: {
    maxConcurrent: 5,
    minTime: 1000,
    highWater: -1,
    strategy: Bottleneck.strategy.LEAK,
    rejectOnDrop: true
  }
}

/**
 * Throttled interface to Etherscan API client.
 * @static
 */
class Client {
  /**
   * No parameters.
   */
  constructor () {
    const priv = {}
    privs.set(this, priv)
    priv.rawClient = new RawClient()
    priv.limiter = new Bottleneck(
      moduleConfig.bottleneck.maxConcurrent,
      moduleConfig.bottleneck.minTime,
      moduleConfig.bottleneck.highWater,
      moduleConfig.bottleneck.strategy,
      moduleConfig.bottleneck.rejectOnDrop
    )
  }
}

// Expose
module.exports = Client
