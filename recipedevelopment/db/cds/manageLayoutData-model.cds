namespace recipe.managelayout;
using {managed } from '@sap/cds/common';

entity UOM {
    key ID : String ;
    Description : String ;
}

entity LayoutType {
    key ID: Integer;
    typeName: String;
}

entity LayoutInformation  {
    key ID : UUID;
    layoutName : String not null;
    description: String(120);
    defaultFlag : Boolean default false;
    layoutType : String;
    referenceQuantity: Double;
    UOM : String;
    createdAt  : Timestamp @cds.on.insert : $now;	
    createdBy  : String(255)      @cds.on.insert : $user;	
  	modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;	
  	modifiedBy : String(255)      @cds.on.insert : $user @cds.on.update : $user;
    columnsSelectedInLayout : Composition of many ColumnsSelectedInLayout on columnsSelectedInLayout.layoutItem =$self;
}

//column
entity CategoryType {
    key ID: Integer;
    categoryName: String;
}

entity Subcategory {
    key ID: Integer;
    categoryId: Integer;
    subCategoryName: String;
}

entity ColumnsSelectedInLayout { 
    key ID: UUID;
    layoutItemId: UUID;
    categoryName: String;
    subCategoryName : String;
    UOM : String; 
    fixedColumn : Boolean;
    columnOrder : Integer;
    layoutItem: Association to one LayoutInformation on layoutItem.ID = layoutItemId;
}
