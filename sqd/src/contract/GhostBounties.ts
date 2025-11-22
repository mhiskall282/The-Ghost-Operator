import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    BountyCancelled: event("0x92717314c0b0f9d632e1d46a0b8437778ff9daee1db8ec295f2bc0b57c4bcaac", "BountyCancelled(uint256)", {"bountyId": indexed(p.uint256)}),
    BountyCompleted: event("0x285d0f935b4d6592b80efc46cc3d9eb3e93e27fe245f0a6c2b5b9a9d04800ee7", "BountyCompleted(uint256,address,uint256)", {"bountyId": indexed(p.uint256), "worker": indexed(p.address), "reward": p.uint256}),
    BountyCreated: event("0x252aa1a15150bafa74a6881d6b00eb706928b5158624bdd5b3fc2bcd5ff01cb7", "BountyCreated(uint256,address,uint8,string,string,uint256)", {"bountyId": indexed(p.uint256), "creator": indexed(p.address), "action": p.uint8, "repoOwner": p.string, "repoName": p.string, "reward": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    _setTestVerifier: fun("0x9b8b30c8", "_setTestVerifier(address)", {"newVerifier": p.address}, ),
    bounties: viewFun("0xdc2f8744", "bounties(uint256)", {"_0": p.uint256}, {"id": p.uint256, "creator": p.address, "action": p.uint8, "repoOwner": p.string, "repoName": p.string, "prOrIssueNumber": p.uint256, "reward": p.uint256, "status": p.uint8, "completedBy": p.address, "createdAt": p.uint256, "completedAt": p.uint256}),
    cancelBounty: fun("0xe5e5dff1", "cancelBounty(uint256)", {"bountyId": p.uint256}, ),
    claimed: viewFun("0x120aa877", "claimed(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.bool),
    completeBounty: fun("0xc15920de", "completeBounty(uint256,((bytes4,bytes32[8],uint8),bytes32,uint256,(address,bytes4,uint256,uint256,bytes32)))", {"bountyId": p.uint256, "proof": p.struct({"seal": p.struct({"verifierSelector": p.bytes4, "seal": p.fixedSizeArray(p.bytes32, 8), "mode": p.uint8}), "callGuestId": p.bytes32, "length": p.uint256, "callAssumptions": p.struct({"proverContractAddress": p.address, "functionSelector": p.bytes4, "settleChainId": p.uint256, "settleBlockNumber": p.uint256, "settleBlockHash": p.bytes32})})}, ),
    completedBounties: viewFun("0xbaf9fbde", "completedBounties(address)", {"_0": p.address}, p.uint256),
    createBounty: fun("0xd0b50709", "createBounty(uint8,string,string,uint256,uint256)", {"action": p.uint8, "repoOwner": p.string, "repoName": p.string, "prOrIssueNumber": p.uint256, "reward": p.uint256}, p.uint256),
    getBounty: viewFun("0xee8c4bbf", "getBounty(uint256)", {"bountyId": p.uint256}, p.struct({"id": p.uint256, "creator": p.address, "action": p.uint8, "repoOwner": p.string, "repoName": p.string, "prOrIssueNumber": p.uint256, "reward": p.uint256, "status": p.uint8, "completedBy": p.address, "createdAt": p.uint256, "completedAt": p.uint256})),
    getWorkerStats: viewFun("0x365ba2dd", "getWorkerStats(address)", {"worker": p.address}, {"completed": p.uint256, "earnings": p.uint256}),
    githubProver: viewFun("0xb5f5f3e8", "githubProver()", {}, p.address),
    nextBountyId: viewFun("0xfd14fad4", "nextBountyId()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    totalEarnings: viewFun("0x85117005", "totalEarnings(address)", {"_0": p.address}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    vault: viewFun("0xfbfa77cf", "vault()", {}, p.address),
    verifier: viewFun("0x2b7ac3f3", "verifier()", {}, p.address),
}

export class Contract extends ContractBase {

    bounties(_0: BountiesParams["_0"]) {
        return this.eth_call(functions.bounties, {_0})
    }

    claimed(_0: ClaimedParams["_0"], _1: ClaimedParams["_1"]) {
        return this.eth_call(functions.claimed, {_0, _1})
    }

    completedBounties(_0: CompletedBountiesParams["_0"]) {
        return this.eth_call(functions.completedBounties, {_0})
    }

    getBounty(bountyId: GetBountyParams["bountyId"]) {
        return this.eth_call(functions.getBounty, {bountyId})
    }

    getWorkerStats(worker: GetWorkerStatsParams["worker"]) {
        return this.eth_call(functions.getWorkerStats, {worker})
    }

    githubProver() {
        return this.eth_call(functions.githubProver, {})
    }

    nextBountyId() {
        return this.eth_call(functions.nextBountyId, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    totalEarnings(_0: TotalEarningsParams["_0"]) {
        return this.eth_call(functions.totalEarnings, {_0})
    }

    vault() {
        return this.eth_call(functions.vault, {})
    }

    verifier() {
        return this.eth_call(functions.verifier, {})
    }
}

/// Event types
export type BountyCancelledEventArgs = EParams<typeof events.BountyCancelled>
export type BountyCompletedEventArgs = EParams<typeof events.BountyCompleted>
export type BountyCreatedEventArgs = EParams<typeof events.BountyCreated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type _setTestVerifierParams = FunctionArguments<typeof functions._setTestVerifier>
export type _setTestVerifierReturn = FunctionReturn<typeof functions._setTestVerifier>

export type BountiesParams = FunctionArguments<typeof functions.bounties>
export type BountiesReturn = FunctionReturn<typeof functions.bounties>

export type CancelBountyParams = FunctionArguments<typeof functions.cancelBounty>
export type CancelBountyReturn = FunctionReturn<typeof functions.cancelBounty>

export type ClaimedParams = FunctionArguments<typeof functions.claimed>
export type ClaimedReturn = FunctionReturn<typeof functions.claimed>

export type CompleteBountyParams = FunctionArguments<typeof functions.completeBounty>
export type CompleteBountyReturn = FunctionReturn<typeof functions.completeBounty>

export type CompletedBountiesParams = FunctionArguments<typeof functions.completedBounties>
export type CompletedBountiesReturn = FunctionReturn<typeof functions.completedBounties>

export type CreateBountyParams = FunctionArguments<typeof functions.createBounty>
export type CreateBountyReturn = FunctionReturn<typeof functions.createBounty>

export type GetBountyParams = FunctionArguments<typeof functions.getBounty>
export type GetBountyReturn = FunctionReturn<typeof functions.getBounty>

export type GetWorkerStatsParams = FunctionArguments<typeof functions.getWorkerStats>
export type GetWorkerStatsReturn = FunctionReturn<typeof functions.getWorkerStats>

export type GithubProverParams = FunctionArguments<typeof functions.githubProver>
export type GithubProverReturn = FunctionReturn<typeof functions.githubProver>

export type NextBountyIdParams = FunctionArguments<typeof functions.nextBountyId>
export type NextBountyIdReturn = FunctionReturn<typeof functions.nextBountyId>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type TotalEarningsParams = FunctionArguments<typeof functions.totalEarnings>
export type TotalEarningsReturn = FunctionReturn<typeof functions.totalEarnings>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type VaultParams = FunctionArguments<typeof functions.vault>
export type VaultReturn = FunctionReturn<typeof functions.vault>

export type VerifierParams = FunctionArguments<typeof functions.verifier>
export type VerifierReturn = FunctionReturn<typeof functions.verifier>

