import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "../config/config.service"
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs"

interface WasteSubmissionTx {
  wasteType: string
  wasteCategory: string
  quantity: number
  binId: number
  userAddress: string
}

interface TxResult {
  txHash: string
  success: boolean
  error?: string
}

@Injectable()
export class CardanoService {
  private readonly logger = new Logger(CardanoService.name)
  private readonly network: string
  private readonly contractAddress: string

  constructor(private configService: ConfigService) {
    this.network = process.env.NETWORK || "Preprod"
    // This would be your deployed contract address
    this.contractAddress =
      "addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jcdetjl6fr0y9jdudksm22hx8x22q3p3q3zyxy84mlefqwslzevet"
  }

  /**
   * Calculate points based on waste type and category using smart contract logic
   */
  calculateContractPoints(wasteType: string, wasteCategory: string, quantity: number): number {
    // Base points by category (matching smart contract logic)
    const categoryPoints = {
      standard: 10,
      battery: 25,
      hazardous: 50,
    }

    // Multiplier by waste type (matching smart contract waste types)
    const typeMultipliers = {
      usb_cable: 1.0,
      phone_charger: 1.2,
      laptop_charger: 1.5,
      hdmi_cable: 1.0,
      audio_cable: 1.0,
      headphones: 1.2,
      earbuds: 1.0,
      bluetooth_speaker: 1.8,
      computer_mouse: 1.0,
      keyboard: 1.2,
      remote_control: 1.0,
      calculator: 1.0,
      smartphone: 2.0,
      basic_phone: 1.5,
      smartwatch: 1.8,
      fitness_tracker: 1.5,
      portable_speaker: 1.5,
      gaming_controller: 1.8,
      tablet: 2.5,
      laptop: 3.0,
      desktop_computer: 4.0,
      monitor: 3.5,
      printer: 3.0,
      phone_battery: 2.5,
      laptop_battery: 3.5,
      power_bank: 2.0,
      car_battery: 5.0,
      ups_battery: 4.0,
    }

    const basePoints = categoryPoints[wasteCategory] || 10
    const multiplier = typeMultipliers[wasteType] || 1.0

    return Math.floor(basePoints * multiplier * quantity)
  }

  /**
   * Build transaction for waste submission to smart contract
   */
  async buildWasteSubmissionTx(submission: WasteSubmissionTx): Promise<string> {
    try {
      this.logger.log(`Building transaction for waste submission: ${submission.wasteType}`)

      // Calculate points using contract logic
      const points = this.calculateContractPoints(submission.wasteType, submission.wasteCategory, submission.quantity)

      // Build transaction using Cardano serialization library
      const txBuilder = CardanoWasm.TransactionBuilder.new(
        CardanoWasm.LinearFee.new(CardanoWasm.BigNum.from_str("44"), CardanoWasm.BigNum.from_str("155381")),
        CardanoWasm.BigNum.from_str("1000000"), // min utxo
        CardanoWasm.BigNum.from_str("500000000"), // pool deposit
        CardanoWasm.BigNum.from_str("2000000"), // key deposit
      )

      // Add contract interaction
      const contractAddr = CardanoWasm.Address.from_bech32(this.contractAddress)

      // Create datum with waste submission data
      const datum = this.createWasteSubmissionDatum(submission, points)

      // Add output to contract
      const output = CardanoWasm.TransactionOutput.new(
        contractAddr,
        CardanoWasm.Value.new(CardanoWasm.BigNum.from_str("2000000")), // 2 ADA
      )

      // Attach datum to output
      output.set_datum(CardanoWasm.Datum.new_data_hash(datum))
      txBuilder.add_output(output)

      // Build the transaction
      const txBody = txBuilder.build()
      const tx = CardanoWasm.Transaction.new(txBody, CardanoWasm.TransactionWitnessSet.new())

      // Return transaction CBOR hex
      return tx.to_hex()
    } catch (error) {
      this.logger.error(`Error building transaction: ${error.message}`)
      throw new Error(`Failed to build transaction: ${error.message}`)
    }
  }

  /**
   * Submit signed transaction to Cardano network
   */
  async submitTransaction(signedTxHex: string): Promise<TxResult> {
    try {
      this.logger.log("Submitting transaction to Cardano network")

      // In a real implementation, you would submit to Cardano node
      // For now, we'll simulate the submission
      const mockTxHash = this.generateMockTxHash()

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      this.logger.log(`Transaction submitted successfully: ${mockTxHash}`)

      return {
        txHash: mockTxHash,
        success: true,
      }
    } catch (error) {
      this.logger.error(`Error submitting transaction: ${error.message}`)
      return {
        txHash: "",
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Query contract for user's total points
   */
  async getUserPointsFromContract(userAddress: string): Promise<number> {
    try {
      this.logger.log(`Querying contract for user points: ${userAddress}`)

      // In a real implementation, you would query the contract UTxOs
      // For now, return mock data
      return 0
    } catch (error) {
      this.logger.error(`Error querying user points: ${error.message}`)
      return 0
    }
  }

  /**
   * Verify transaction on-chain
   */
  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying transaction: ${txHash}`)

      // In a real implementation, you would check if the transaction exists on-chain
      // For now, simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      this.logger.error(`Error verifying transaction: ${error.message}`)
      return false
    }
  }

  /**
   * Create datum for waste submission
   */
  private createWasteSubmissionDatum(submission: WasteSubmissionTx, points: number): CardanoWasm.DataHash {
    try {
      // Create PlutusData for the submission
      const datumFields = CardanoWasm.PlutusList.new()

      // Add waste type as bytes
      const wasteTypeBytes = CardanoWasm.PlutusData.new_bytes(Buffer.from(submission.wasteType, "utf8"))
      datumFields.add(wasteTypeBytes)

      // Add quantity as integer
      const quantityData = CardanoWasm.PlutusData.new_integer(
        CardanoWasm.BigInt.from_str(submission.quantity.toString()),
      )
      datumFields.add(quantityData)

      // Add points as integer
      const pointsData = CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str(points.toString()))
      datumFields.add(pointsData)

      // Add bin ID as integer
      const binIdData = CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str(submission.binId.toString()))
      datumFields.add(binIdData)

      // Create constructor data (0 for waste submission)
      const datum = CardanoWasm.PlutusData.new_constr_plutus_data(
        CardanoWasm.ConstrPlutusData.new(CardanoWasm.BigNum.from_str("0"), datumFields),
      )

      // Hash the datum
      return CardanoWasm.hash_plutus_data(datum)
    } catch (error) {
      this.logger.error(`Error creating datum: ${error.message}`)
      throw error
    }
  }

  /**
   * Generate mock transaction hash for testing
   */
  private generateMockTxHash(): string {
    const chars = "0123456789abcdef"
    let result = ""
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Get supported waste types from contract
   */
  getSupportedWasteTypes(): string[] {
    return [
      "usb_cable",
      "phone_charger",
      "laptop_charger",
      "hdmi_cable",
      "audio_cable",
      "headphones",
      "earbuds",
      "bluetooth_speaker",
      "computer_mouse",
      "keyboard",
      "remote_control",
      "calculator",
      "smartphone",
      "basic_phone",
      "smartwatch",
      "fitness_tracker",
      "portable_speaker",
      "gaming_controller",
      "tablet",
      "laptop",
      "desktop_computer",
      "monitor",
      "printer",
      "phone_battery",
      "laptop_battery",
      "power_bank",
      "car_battery",
      "ups_battery",
    ]
  }
}
