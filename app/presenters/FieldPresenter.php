<?php

namespace App\Presenters;

use App\Model\Field\Field;
use Doctrine\ORM\EntityManager;
use Drahak\Restful\Application\UI\ResourcePresenter;

/**
 * Class FieldPresenter
 * @package App\Presenters
 */
class FieldPresenter extends ResourcePresenter
{
    /** @var  EntityManager $doctrine
     * @inject
     */
    public $doctrine;

    public function actionCreate()
    {
        $this->resource->action = 'Create';
    }

    public function actionRead()
    {
        $fields = $this->doctrine->getRepository(Field::getClassName())->findAll();
        $this->resource->data = $fields;
    }

    public function actionUpdate()
    {
        $this->resource->action = 'Update';
    }

    public function actionDelete()
    {
        $this->resource->action = 'Delete';
    }

}