import FungibleToken from Flow.FungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

transaction(recipient: Address, amount: UFix64) {
    let tenant: &RegistrySampleContract.Tenant{RegistrySampleContract.ITenant}
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tenant = signer.borrow<&RegistrySampleContract.Tenant{RegistrySampleContract.ITenant}>(from: RegistrySampleContract.TenantStoragePath)
                                ?? panic("Unable to borrow tenant")

        self.tokenReceiver = getAccount(recipient).getCapability(RegistrySampleContract.ReceiverPublicPath)
                                .borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let mintedVault <- self.tenant.minterRef().mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)
    }
}