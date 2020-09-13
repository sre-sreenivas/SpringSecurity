namespace complianceevaluator.datamodel;
using {managed} from '@sap/cds/common';
using { sap, Country } from '@sap/cds/common'; 
using { sap.common.Countries } from '@sap/cds/common';

entity Evaluation : managed{
    key evaluationID : UUID;
    evaluationName  : String ;
    brief  : String; 
    sellingMarket : String;
    validFrom  : Date;
    validTo : Date;
    virtual recipeCount : Integer;
    evalStatus : String;
    virtual compliantRecipeCount : Integer; 
    virtual recipeCriticalityIndicator : Integer;
    nextEvalStatus : String;
    virtual criticality : Integer;
    recipe: Composition of many Recipe on recipe.evaluationRecipe =$self;
    market : Composition of many EvaluationSellingMarket on market.EVALUATIONMARKET = $self;
    purpose: Composition of many Purpose on purpose.evaluationPurpose =$self;
}

 entity CountryForValueHelp{
        key ID: Integer;
        country: Country;
        countryName: String;
    }

entity EvaluationStatus
{
    key ID: Integer;
    status : String;
    nextStatus : String;
}
entity EvaluationSellingMarket  {
    key ID : UUID;
    evaluationID : UUID;
    sellingMarketID : String;
    sellingMarket : String;
    EVALUATIONMARKET : Association to one Evaluation on EVALUATIONMARKET.evaluationID=evaluationID;
 }
entity MasterRecipe {
  key recipeUUID: UUID;
  recipeDescription : String;
  validityArea : String;
  validityDate : String;
  recipeType : String;
  recipeTypeDesc: String;
  recipeStatus : String;
  recipeStatusDesc : String;
  createdBy: String;
  createdOn: String;
  changedBy: String;
  changedOn: String;
}

entity Recipe
{
    key ID: UUID;
    evaluationID : UUID;
    recipeDescription: String;
    recipeType : String;
    compliantStatus: String;
    relevantEvaluation: Boolean;
    recipeId: String;
    copyRecipe: String;
    recipeStatus: String;
    createdBy: String;
	createdOn: String;
	changedBy: String;
	changedOn: String;
	evaluationRecipe: Association to one Evaluation on evaluationRecipe.evaluationID=evaluationID;
}

entity Requirement {
    key ID: UUID;
    requirement: String;
    requirementType: String;
    effectiveDate: Date;
    purposeId: UUID;
} 

entity MasterPurpose {
    key ID : UUID;
    purpose : String;
    noOfRequirements : Integer;
    activationStatus : String;
    createdBy : String;
    createdOn : String;
}
entity Purpose {
    key ID: UUID;
    purposeId: String;
    evaluationID : UUID;
    purpose : String;
    requirement: String;
    requirementID: String;
    purposeType : String;
    addedOn: Date;
    addedBy: String;
    validityArea : String;
    evaluationPurpose: Association to one Evaluation on evaluationPurpose.evaluationID=evaluationID;
}
 
