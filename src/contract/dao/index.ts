import { isIPAddress, isAddress } from "../../utils/validation.js";
import { OperationType } from "../../types/operation.js";
import { TimeStamp } from "../../utils/time.js";
import { Fact } from "../../types/fact.js";

import { CreateDAOFact } from "./create.js";
import { daoData } from "./design.js";

export class Dao {
  private _networkID: string = "";
  private _node: string = "";
  private _contractAddress: string = "";
  private _serviceID: string = "";

  constructor(networkID: string, provider?: string) {
    this._setNode(provider);
    this._setChain(networkID);
  }

  private _setNode(provider?: string) {
    if (isIPAddress(provider)) {
      this._node = provider as string;
    }
  }

  private _setChain(networkID: string) {
    this._networkID = networkID;
  }

  setContractAddress(contractAddress: string) {
    if (
      this._contractAddress !== contractAddress &&
      isAddress(contractAddress)
    ) {
      this._contractAddress = contractAddress;
      console.log("Contract address is changed : ", this._contractAddress);
    } else {
      console.error("This is invalid address type");
    }
  }

  setServiceId(serviceId: string) {
    if (this._serviceID !== serviceId) {
      this._serviceID = serviceId;
      console.log("Credential ID is changed : ", this._serviceID);
    }
  }

  getContractAddress(): string {
    return this._contractAddress.toString();
  }

  getServiceId(): string {
    return this._serviceID.toString();
  }

  /** daoData object 
   daoData = {
        serviceId: string,
        option: string "crypto" or "biz",
        voteToken: string,
        threshold: number,
        fee: number,
        proposers: string[],
        waitingTime: number,
        registrationPeriod: number,
        preSnapPeriod: number,
        votingPeriod: number,
        postSnapPeriod: number,
        timelock: number,
        turnout: number,
        quorum: number,
   } 
  */
  createDAOService(
    sender: string,
    data: daoData,
    currency: string
  ): OperationType<Fact> {
    this.setServiceId(data.serviceId);

    const token = new TimeStamp().UTC();

    const fact = new CreateDAOFact(
      token,
      sender,
      this._contractAddress,
      this._serviceID,
      data.option,
      data.voteToken,
      data.threshold,
      data.fee,
      data.proposers,
      data.waitingTime,
      data.registrationPeriod,
      data.preSnapPeriod,
      data.votingPeriod,
      data.postSnapPeriod,
      data.timelock,
      data.turnout,
      data.quorum,
      currency
    );

    return new OperationType(this._networkID, fact);
  }
}