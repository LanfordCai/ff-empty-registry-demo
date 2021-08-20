import FungibleToken from Flow.FungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the RegistrySampleContract

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&RegistrySampleContract.Vault>(from: RegistrySampleContract.VaultStoragePath) == nil {
            // Create a new RegistrySampleContract Vault and put it in storage
            signer.save(<-RegistrySampleContract.createEmptyVault(), to: RegistrySampleContract.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&RegistrySampleContract.Vault{FungibleToken.Receiver}>(
                RegistrySampleContract.ReceiverPublicPath,
                target: RegistrySampleContract.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&RegistrySampleContract.Vault{FungibleToken.Balance}>(
                RegistrySampleContract.BalancePublicPath,
                target: RegistrySampleContract.VaultStoragePath
            )
        }
    }
}
