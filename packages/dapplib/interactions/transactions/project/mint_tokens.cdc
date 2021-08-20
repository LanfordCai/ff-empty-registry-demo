import FungibleToken from Flow.FungibleToken
import RegistryFTContract from Project.RegistryFTContract

transaction(recipient: Address, amount: UFix64) {
    let tenant: &RegistryFTContract.Tenant{RegistryFTContract.ITenant}
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tenant = signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath)
                                ?? panic("Unable to borrow tenant")

        self.tokenReceiver = getAccount(recipient).getCapability(RegistryFTContract.ReceiverPublicPath)
                                .borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let mintedVault <- self.tenant.minterRef().mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)
    }
}