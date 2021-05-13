import * as amf from 'amf-client-js'
import * as fs from 'fs'
import * as path from 'path'

amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFValidation.register();

(async () => {
    await amf.Core.init()  
    const dialectUrl = `file://${path.join(__dirname, 'dialect.yaml')}`
    const instanceUrl = `file://${path.join(__dirname, 'instance.yaml')}`
    
    try {
      const parser = amf.Core.parser('AML 1.0', 'application/yaml')
      
      const dialectBaseUnit = await parser.parseFileAsync(dialectUrl)
      const dialectValidationReport = await amf.Core.validate(dialectBaseUnit, new amf.ProfileName('AML 1.0'))
      console.log(dialectValidationReport.toString())
      
      
      const intanceBaseUnit = await parser.parseFileAsync(instanceUrl)
      const instanceValidationReport = await amf.Core.validate(intanceBaseUnit, new amf.ProfileName('AML 1.0'))
      console.log(instanceValidationReport.toString())
  
      const generator = amf.Core.generator('AMF Graph', 'application/ld+json')
      const renderOptions = new amf.render.RenderOptions().withSourceMaps.withCompactUris.withFlattenedJsonLd.withPrettyPrint
      
      const instanceJsonLd = await generator.generateString(intanceBaseUnit, renderOptions)
      
      fs.writeFileSync('instance.jsonld', instanceJsonLd, 'utf-8')
    } catch (e) {
      console.error(e)
    }
  })()