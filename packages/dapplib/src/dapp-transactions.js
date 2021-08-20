// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static project_donate() {
		return fcl.transaction`
				
				import Faucet from 0x01cf0e2f2f715450
				import RegistryFTContract from 0x01cf0e2f2f715450
				
				transaction(amount: UFix64) {
				    let tenant: &RegistryFTContract.Tenant{RegistryFTContract.ITenant}
				    let vault: &RegistryFTContract.Vault
				    let donater: Address
				    prepare(signer: AuthAccount) {
				        self.tenant = signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath)
				                                ?? panic("Unable to borrow tenant")
				        self.vault = signer.borrow<&RegistryFTContract.Vault>(from: RegistryFTContract.VaultStoragePath)
							?? panic("Could not borrow reference to the owner's Vault!")
				        self.donater = signer.address
				    }
				    execute {
				        let amt <- self.vault.withdraw(amount: amount)
				        Faucet.donate(donater: self.donater, from: <- amt)
				    }
				}
				
		`;
	}

	static project_mint_tokens() {
		return fcl.transaction`
				import FungibleToken from 0x01cf0e2f2f715450
				import RegistryFTContract from 0x01cf0e2f2f715450
				
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
		`;
	}

	static project_setup_account() {
		return fcl.transaction`
				import FungibleToken from 0x01cf0e2f2f715450
				import RegistryFTContract from 0x01cf0e2f2f715450
				
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
				
		`;
	}

	static project_take_tokens() {
		return fcl.transaction`
				import FungibleToken from 0x01cf0e2f2f715450
				import RegistryFTContract from 0x01cf0e2f2f715450
				import Faucet from 0x01cf0e2f2f715450
				
				transaction(amount: UFix64) {
				    let tenant: &RegistryFTContract.Tenant{RegistryFTContract.ITenant}
				    let tokenReceiver: &{FungibleToken.Receiver}
				
				    prepare(signer: AuthAccount) {
				        self.tenant = signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath)
				                                ?? panic("Unable to borrow tenant")
				
				        self.tokenReceiver = signer.getCapability(RegistryFTContract.ReceiverPublicPath)
				                                .borrow<&{FungibleToken.Receiver}>()
				                                ?? panic("Unable to borrow receiver reference")
				    }
				
				    execute {
				        let amt <- Faucet.take(amount: amount)
				
				        self.tokenReceiver.deposit(from: <-amt)
				    }
				}
		`;
	}

	static registry_receive_auth_nft() {
		return fcl.transaction`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Allows a Tenant to register with the RegistryService. It will
				// save an AuthNFT to account storage. Once an account
				// has an AuthNFT, they can then get Tenant Resources from any contract
				// in the Registry.
				//
				// Note that this only ever needs to be called once per Tenant
				
				transaction() {
				
				    prepare(signer: AuthAccount) {
				        // if this account doesn't already have an AuthNFT...
				        if signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath) == nil {
				            // save a new AuthNFT to account storage
				            signer.save(<-RegistryService.register(), to: RegistryService.AuthStoragePath)
				
				            // we only expose the IAuthNFT interface so all this does is allow us to read
				            // the authID inside the AuthNFT reference
				            signer.link<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>(RegistryService.AuthPublicPath, target: RegistryService.AuthStoragePath)
				        }
				    }
				
				    execute {
				
				    }
				}
		`;
	}

	static registry_receive_tenant() {
		return fcl.transaction`
				import RegistryFTContract from 0x01cf0e2f2f715450
				import RegistryService from 0x01cf0e2f2f715450
				
				// This transaction allows any Tenant to receive a Tenant Resource from
				// RegistryFTContract. It saves the resource to account storage.
				//
				// Note that this can only be called by someone who has already registered
				// with the RegistryService and received an AuthNFT.
				
				transaction() {
				
				  prepare(signer: AuthAccount) {
				    // save the Tenant resource to the account if it doesn't already exist
				    if signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath) == nil {
				      // borrow a reference to the AuthNFT in account storage
				      let authNFTRef = signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath)
				                        ?? panic("Could not borrow the AuthNFT")
				      
				      // save the new Tenant resource from RegistryFTContract to account storage
				      signer.save(<-RegistryFTContract.instance(authNFT: authNFTRef), to: RegistryFTContract.TenantStoragePath)
				
				      // link the Tenant resource to the public
				      //
				      // NOTE: this is commented out for now because it is dangerous to link
				      // our Tenant to the public without any resource interfaces restricting it.
				      // If you add resource interfaces that Tenant must implement, you can
				      // add those here and then uncomment the line below.
				      // 
				      signer.link<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(RegistryFTContract.TenantPublicPath, target: RegistryFTContract.TenantStoragePath)
				    }
				  }
				
				  execute {
				    log("Registered a new Tenant for RegistryFTContract.")
				  }
				}
				
		`;
	}

}
