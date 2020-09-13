namespace formulation.datamodel;
using {managed} from '@sap/cds/common';

entity Recipe : managed {
    key recipeID : UUID;
    recipeNAME : String;
    recipeDESCRIPTION : String;
    recipeTYPE: String;
    VALID_TO : Date;
    VALID_FROM : Date;
    evaluationID : UUID;
    evaluationName: String;
	Virtual UseLimitsOfevaluationSheet: String;
    recipe: Composition of many RecipeSpecification on recipe.RecipeSpecification = $self;
}


entity RecipeSpecification{
    key ID : UUID;
    recipeID : UUID;
    specificationID : String;
    specificationDescription: String;
    formulaItemDescription :String;
    density : Double;
    piecetoMass: Double;
     quantity :Decimal  default '0';
    UOM : String default 'KG';
    componentType : String; 
    itemNumber : Integer;
    nextItemNumber : Integer; 
    RecipeSpecification: Association to one Recipe on RecipeSpecification.recipeID=recipeID;
}


entity Specification{
   key specificationID  : String;
    specificationDescription : String;
    formulaItemDescription : String;
    density : Double;
    piecetoMass: Double;
    createdBY : String;
    specType : String;
    specificationVersion : Double;
}
 
entity UOM{
     key Id : String;
     description : String;
}
      
entity ComponentType{
    key ID : String;
    item : String;
     description : String;
}


entity RecipeType{
     key ID : String ;
     description : String;
}

entity Subcategory {
    key ID: Integer;
    categoryId: Integer;
    subCategoryName: String;
}


entity StandardUOM {
	Key id: String;
	Kg : String;
	cm3 : String;
	dependency: String;
	description : String;
}
