-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "properties_city_idx" ON "properties"("city");

-- CreateIndex
CREATE INDEX "properties_rent_idx" ON "properties"("rent");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_categoryId_idx" ON "properties"("categoryId");

-- CreateIndex
CREATE INDEX "rentalRequests_status_idx" ON "rentalRequests"("status");

-- CreateIndex
CREATE INDEX "rentalRequests_tenantId_idx" ON "rentalRequests"("tenantId");

-- CreateIndex
CREATE INDEX "rentalRequests_propertyId_idx" ON "rentalRequests"("propertyId");

-- CreateIndex
CREATE INDEX "reviews_tenantId_idx" ON "reviews"("tenantId");

-- CreateIndex
CREATE INDEX "reviews_propertyId_idx" ON "reviews"("propertyId");
