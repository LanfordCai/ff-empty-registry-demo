import Faucet from Project.Faucet

pub fun main(account: Address): UFix64 {
    return Faucet.donatedAmount(donater: account)
}