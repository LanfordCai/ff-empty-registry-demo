import FungibleToken from Flow.FungibleToken
import RegistryFTContract from Project.RegistryFTContract

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the RegistryFTContract

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&RegistryFTContract.Vault>(from: RegistryFTContract.VaultStoragePath) == nil {
            // Create a new RegistryFTContract Vault and put it in storage
            signer.save(<-RegistryFTContract.createEmptyVault(), to: RegistryFTContract.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&RegistryFTContract.Vault{FungibleToken.Receiver}>(
                RegistryFTContract.ReceiverPublicPath,
                target: RegistryFTContract.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&RegistryFTContract.Vault{FungibleToken.Balance}>(
                RegistryFTContract.BalancePublicPath,
                target: RegistryFTContract.VaultStoragePath
            )
        }
    }
}
