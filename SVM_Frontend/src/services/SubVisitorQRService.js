import { encodeSecureQrPayload } from "../utils/secureQrPayload";
import VisitorService from "./VisitorService";

/**
 * Generate a secure QR code for a sub-visitor with all details
 * Includes: sub-visitor name, NIC, main visitor info, and items
 */
const GenerateSubVisitorQR = async (subVisitorData, mainVisitorData, requestId) => {
  try {
    console.log("[SubVisitorQRService] Generating QR for sub-visitor:", subVisitorData);
    
    // Fetch items associated with this sub-visitor/request
    let itemsData = [];
    try {
      const itemsResponse = await VisitorService.GetVisitorJoint(requestId);
      if (itemsResponse?.data) {
        const items = Array.isArray(itemsResponse.data) 
          ? itemsResponse.data 
          : itemsResponse.data.ResultSet || itemsResponse.data.data || [];
        
        // Filter items specific to this sub-visitor if item has group member reference
        itemsData = items.map(item => ({
          itemName: item.Item_Name || item.ItemName || item.name || "N/A",
          itemDescription: item.Item_Description || item.Description || item.description || "",
          itemQuantity: item.Item_Quantity || item.Quantity || item.quantity || 1,
          itemId: item.IC_Item_Carried_id || item.ItemId || item.id || "N/A",
        }));
      }
    } catch (err) {
      console.warn("[SubVisitorQRService] Could not fetch items:", err);
      itemsData = [];
    }

    // Build QR payload for sub-visitor (keep it compact for better scannability)
    const qrPayload = {
      type: "subVisitor",
      id: requestId, // Use requestId as the main ID for database lookup
      subVisitor: {
        name: subVisitorData.name || subVisitorData.Group_Members || "N/A",
        nic: subVisitorData.nic || subVisitorData.Members_NIC_Passport_Number || "N/A",
      },
      mainVisitor: {
        name: mainVisitorData.visitorName || mainVisitorData.VV_Name || "N/A",
        id: mainVisitorData.visitorId || mainVisitorData.VV_Visitor_id || "N/A",
      },
      // Items included but kept minimal to reduce payload size
      items: itemsData.slice(0, 3).map(item => ({
        n: item.itemName,
        q: item.itemQuantity || 1,
      })),
    };

    console.log("[SubVisitorQRService] Final QR payload:", qrPayload);
    
    // Encode the payload securely
    const encodedQR = await encodeSecureQrPayload(qrPayload);
    console.log("[SubVisitorQRService] QR encoded successfully, length:", encodedQR.length);
    
    return encodedQR;
  } catch (err) {
    console.error("[SubVisitorQRService] Error generating sub-visitor QR:", err);
    throw err;
  }
};

/**
 * Generate QR codes for all sub-visitors
 */
const GenerateMultipleSubVisitorQRs = async (subVisitorsArray, mainVisitorData, requestId) => {
  try {
    console.log("[SubVisitorQRService] Generating QRs for", subVisitorsArray.length, "sub-visitors");
    
    const qrResults = await Promise.all(
      subVisitorsArray.map(async (subVisitor, index) => {
        try {
          const qrCode = await GenerateSubVisitorQR(subVisitor, mainVisitorData, requestId);
          return {
            subVisitorName: subVisitor.name || subVisitor.Group_Members || "Sub-Visitor " + (index + 1),
            qrCode,
            success: true,
          };
        } catch (err) {
          console.error(`[SubVisitorQRService] Failed for sub-visitor ${index}:`, err);
          return {
            subVisitorName: subVisitor.name || subVisitor.Group_Members || "Sub-Visitor " + (index + 1),
            qrCode: null,
            success: false,
            error: err.message,
          };
        }
      })
    );
    
    return qrResults;
  } catch (err) {
    console.error("[SubVisitorQRService] Error generating multiple QRs:", err);
    throw err;
  }
};

export default {
  GenerateSubVisitorQR,
  GenerateMultipleSubVisitorQRs,
};
