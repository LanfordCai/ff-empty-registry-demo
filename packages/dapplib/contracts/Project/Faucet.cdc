import RegistryFTContract from Project.RegistryFTContract
import FungibleToken from Flow.FungibleToken

// This is a blank ComposedContract template. It imports
// the blank RegistryFTContract template because you will
// use that in here.

pub contract Faucet {

    access(contract) var donateRecords: {Address: UFix64}
    access(contract) let vault: @RegistryFTContract.Vault

    // Anyone can donate to this faucet
    pub fun donate(donater: Address, from: @FungibleToken.Vault) {
        if let balance = self.donateRecords[donater] {
            self.donateRecords[donater] = balance + from.balance
        } else {
            self.donateRecords[donater] = from.balance
        }
        self.vault.deposit(from: <- from)
    }

    // Anyone can take token from this faucet,
    // but the maximum amount is 2.0
    pub fun take(amount: UFix64): @FungibleToken.Vault {
        pre {
            amount <= 2.0: "Max amount is 2.0"
        }
        return <- self.vault.withdraw(amount: amount)
    }

    pub fun donatedAmount(donater: Address): UFix64 {
        if let amount = self.donateRecords[donater] {
            return amount
        }
        return 0.0
    }

    pub fun balance(): UFix64 {
        return self.vault.balance
    }

    init() {
        self.donateRecords = {}
        self.vault <- RegistryFTContract.createEmptyVault()
    }
}