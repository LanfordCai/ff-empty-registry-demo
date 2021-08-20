import FungibleToken from Flow.FungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/RegistrySampleContractBalance)
        .borrow<&RegistrySampleContract.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}  