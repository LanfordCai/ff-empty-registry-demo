import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('sample-harness')
export default class SampleHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- Registry -->
      
        <action-card title="Registry - Get Auth NFT"
          description="Register a Tenant with the RegistryService to get an AuthNFT" action="receiveAuthNFT" method="post"
          fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="Registry - Has Auth NFT" description="Checks to see if an account has an AuthNFT"
          action="hasAuthNFT" method="get" fields="tenant">
          <account-widget field="tenant" label="Tenant Account">
          </account-widget>
        </action-card>
      
        <action-card title="RegistryFTContract - Get Tenant"
          description="Get an instance of a Tenant from RegistryFTContract to have your own data" action="receiveTenant"
          method="post" fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>

        <action-card title="RegistryFTContract - Setup Account"
          description="Add token paths to account" action="setupAccount"
          method="post" fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>
      
        <!-- Flow Token -->
        <action-card title="Get Balance" description="Get the Flow Token balance of an account" action="getBalance"
          method="get" fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>

        <action-card title="Mint Tokens" description="Mint tokens into an account" action="mintTokens"
          method="post" fields="signer recipient amount">
          <account-widget field="signer" label="Account">
          </account-widget>
          <text-widget field="amount" label="Amount" placeholder="30.0"></text-widget>
        </action-card>

        <action-card title="Donate" description="Donate to faucet" action="donate"
          method="post" fields="signer amount">
          <account-widget field="signer" label="Account">
          </account-widget>
          <text-widget field="amount" label="Amount" placeholder="30.0"></text-widget>
        </action-card>

        <action-card title="Donated Amount" description="Get the amount donated" action="donatedAmount"
          method="get" fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>

        <action-card title="Faucet Balance" description="Get balance of the faucet" action="faucetBalance"
          method="get" fields="">
        </action-card>

        <action-card title="Take tokens" description="Take tokens from faucet" action="takeTokens"
          method="post" fields="signer amount">
          <account-widget field="signer" label="Account">
          </account-widget>
          <text-widget field="amount" label="Amount" placeholder="1.0"></text-widget>
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
