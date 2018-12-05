import { registerBidder } from 'src/adapters/bidderFactory';
import { BANNER, NATIVE, VIDEO } from 'src/mediaTypes';
import * as utils from 'src/utils';

const BIDDER_CODE = 'advenue';
const URL = '//supply.advenuemedia.co.uk/?c=o&m=multi';
const URL_SYNC = '//supply.advenuemedia.co.uk/?c=o&m=cookie';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER, VIDEO, NATIVE],

  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {object} bid The bid to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: (bid) => {
    return Boolean(bid.bidId &&
        bid.params &&
        !isNaN(bid.params.placementId) &&
        spec.supportedMediaTypes.indexOf(bid.params.traffic) !== -1
    );
  },

  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {BidRequest[]} validBidRequests A non-empty list of valid bid requests that should be sent to the Server.
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: (validBidRequests) => {
    let winTop;
    try {
      winTop = utils.getWindowTop();
      winTop.location.toString();
    } catch (e) {
      utils.logMessage(e);
      winTop = window;
    };

    const location = utils.getTopWindowLocation();
    const placements = [];
    const request = {
      'secure': (location.protocol === 'https:') ? 1 : 0,
      'deviceWidth': winTop.screen.width,
      'deviceHeight': winTop.screen.height,
      'host': location.host,
      'page': location.pathname,
      'placements': placements
    };

    for (let i = 0; i < validBidRequests.length; i++) {
      const bid = validBidRequests[i];
      const params = bid.params;
      placements.push({
        placementId: params.placementId,
        bidId: bid.bidId,
        sizes: bid.sizes,
        traffic: params.traffic
      });
    }
    return {
      method: 'POST',
      url: URL,
      data: request
    };
  },

  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {*} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: (serverResponse) => {
    let response = [];
    try {
      serverResponse = serverResponse.body;
      for (let i = 0; i < serverResponse.length; i++) {
        let resItem = serverResponse[i];
      }
    } catch (e) {
      utils.logMessage(e);
    };
    return response;
  },

  getUserSyncs: () => {
    return [{
      type: 'image',
      url: URL_SYNC
    }];
  }
};

registerBidder(spec);
