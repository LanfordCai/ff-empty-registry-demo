import FungibleToken from Flow.FungibleToken
import RegistryFTContract from Project.RegistryFTContract

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(RegistryFTContract.BalancePublicPath)
        .borrow<&RegistryFTContract.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}  